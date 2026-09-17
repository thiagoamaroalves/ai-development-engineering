import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'
import { dirname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AdrAuthorityObservation,
  AdrAuthorityCatalog,
  AdrAuthorityReader,
  AdrContentHash,
  AdrDecisionStatus,
  AdrDomainError,
  AdrImplementedSuccession,
  AdrImplementedSuccessionRepository,
  AdrRecord,
  AdrRemediation,
  AdrRealizationStatus,
  AdrRevisionRepository,
  DerivedEligibility,
} from '../src/domain/adr.js'
import {
  CanonicalIdentityReference,
} from '../src/domain/identity.js'
import { ReadAdrAuthorityHandler, RemediateAdrHandler, SucceedImplementedAdrHandler } from '../src/application/adr.js'
import { observationFromRecord } from '../src/domain/adr.js'

class InMemoryAdrRepository implements AdrRevisionRepository {
  readonly records = new Map<string, AdrRecord>()
  reserveCalls = 0

  seed(record: AdrRecord): void {
    this.records.set(record.reference.canonicalKey, record)
  }

  find(reference: CanonicalIdentityReference): AdrRecord | undefined {
    return this.records.get(reference.canonicalKey)
  }

  async reserveRemediation(
    remediation: AdrRemediation,
    _expectedAuthority: AdrAuthorityObservation,
    _authorityReader: AdrAuthorityReader,
  ) {
    this.reserveCalls += 1
    const key = remediation.successor.reference.canonicalKey
    const existing = this.records.get(key)
    if (existing) return { status: 'DUPLICATE' as const, existing }
    this.records.set(remediation.predecessor.reference.canonicalKey, remediation.predecessor)
    this.records.set(key, remediation.successor)
    return { status: 'ACCEPTED' as const, remediation }
  }
}

class SequenceAdrReader implements AdrAuthorityReader {
  observations: AdrAuthorityObservation[] = []

  constructor(private readonly record: AdrRecord) {}

  observe(reference: CanonicalIdentityReference): AdrAuthorityObservation | undefined {
    if (!reference.equals(this.record.reference)) return undefined
    const next = this.observations.shift()
    return next ?? observationFromRecord(this.record)
  }
}

class InMemoryImplementedSuccessionRepository implements AdrImplementedSuccessionRepository {
  readonly records = new Map<string, AdrRecord>()
  reserveCalls = 0

  seed(record: AdrRecord): void {
    this.records.set(record.reference.canonicalKey, record)
  }

  find(reference: CanonicalIdentityReference): AdrRecord | undefined {
    return this.records.get(reference.canonicalKey)
  }

  async reserveImplementedSuccession(succession: AdrImplementedSuccession) {
    this.reserveCalls += 1
    const existing = this.records.get(succession.successor.reference.canonicalKey)
    if (existing) return { status: 'DUPLICATE' as const, existing }
    this.records.set(succession.predecessor.reference.canonicalKey, succession.predecessor)
    this.records.set(succession.successor.reference.canonicalKey, succession.successor)
    return { status: 'ACCEPTED' as const, succession }
  }
}

function reference(revision = 1): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({
    identity: { kind: 'ADR', scope: 'REPOSITORY-001', value: 'ADR-0001' },
    revision,
  })
}

function distinctAdrReference(value = 'ADR-0002', revision = 1): CanonicalIdentityReference {
  return CanonicalIdentityReference.create({
    identity: { kind: 'ADR', scope: 'REPOSITORY-001', value },
    revision,
  })
}

function acceptedAdr(revision = 1, hash = 'sha256:adr-v1'): AdrRecord {
  return AdrRecord.create({
    reference: reference(revision),
    contentHash: hash,
    decisionStatus: 'ACCEPTED',
    realizationStatus: 'UNPROCESSED',
    derivedEligibility: DerivedEligibility.eligible(),
  })
}

function mutableRecordClone(record: AdrRecord): AdrRecord {
  const clone = Object.assign(Object.create(Object.getPrototypeOf(record)), record) as AdrRecord
  ;(clone as unknown as { decisionStatus: AdrDecisionStatus }).decisionStatus = mutableValueObjectClone(record.decisionStatus)
  ;(clone as unknown as { realizationStatus: AdrRealizationStatus }).realizationStatus = mutableValueObjectClone(record.realizationStatus)
  return clone
}

function mutableValueObjectClone<T extends object>(value: T): T {
  return Object.assign(Object.create(Object.getPrototypeOf(value)), value) as T
}

function isMemberAccessBefore(source: string, start: number): boolean {
  let index = start - 1

  while (index >= 0 && /\s/.test(source[index])) index -= 1
  while (index >= 1 && source[index] === '/' && source[index - 1] === '*') {
    const commentStart = source.lastIndexOf('/*', index - 1)
    assert.notEqual(commentStart, -1, 'productive graph contains an unterminated block comment')
    index = commentStart - 1
    while (index >= 0 && /\s/.test(source[index])) index -= 1
  }

  return source[index] === '.'
}

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const productiveSourceRoot = resolve(repositoryRoot, 'src')
const architectureEntryPoints = [
  resolve(productiveSourceRoot, 'domain', 'adr.ts'),
  resolve(productiveSourceRoot, 'application', 'adr.ts'),
]
const forbiddenProductiveDependency = /\bprototype\b|\binfrastructure\b|\bdatabase\b|\bfilesystem\b|\bhttp\b|\breact\b|\bvite\b|\borm\b|\bgithub\b|\bsqlite\b|\bpostgres\b|node:fs|node:path/i

interface ParsedLiteral {
  value: string
  next: number
}

interface ScannedTemplate {
  expressions: string[]
  next: number
}

const templateQuote = String.fromCharCode(96)

function isLineTerminator(character: string | undefined): boolean {
  return character === '\r' || character === '\n' || character === '\u2028' || character === '\u2029'
}

function skipTrivia(source: string, start: number): number {
  let index = start

  while (index < source.length) {
    const character = source[index]
    if (/\s/.test(character) || isLineTerminator(character)) {
      index += 1
      continue
    }

    if (source.startsWith('/*', index)) {
      const end = source.indexOf('*/', index + 2)
      assert.notEqual(end, -1, 'productive graph contains an unterminated block comment')
      index = end + 2
      continue
    }

    if (source.startsWith('//', index)) {
      index += 2
      while (index < source.length && !isLineTerminator(source[index])) index += 1
      continue
    }

    break
  }

  return index
}

function hexValue(character: string | undefined): number | undefined {
  if (character === undefined) return undefined
  const code = character.charCodeAt(0)
  if (code >= 48 && code <= 57) return code - 48
  if (code >= 65 && code <= 70) return code - 55
  if (code >= 97 && code <= 102) return code - 87
  return undefined
}

function readFixedHexEscape(source: string, start: number, length: number): { character: string; next: number } | undefined {
  let value = 0
  for (let offset = 0; offset < length; offset += 1) {
    const digit = hexValue(source[start + offset])
    if (digit === undefined) return undefined
    value = value * 16 + digit
  }
  return { character: String.fromCodePoint(value), next: start + length }
}

function readUnicodeIdentifierEscape(source: string, start: number): { character: string; next: number } | undefined {
  if (source[start] !== '\\' || source[start + 1] !== 'u') return undefined

  if (source[start + 2] === '{') {
    const close = source.indexOf('}', start + 3)
    if (close === -1) return undefined
    const digits = source.slice(start + 3, close)
    if (digits.length === 0) return undefined
    let codePoint = 0
    for (const digitCharacter of digits) {
      const digit = hexValue(digitCharacter)
      if (digit === undefined) return undefined
      codePoint = codePoint * 16 + digit
    }
    if (codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return undefined
    return { character: String.fromCodePoint(codePoint), next: close + 1 }
  }

  return readFixedHexEscape(source, start + 2, 4)
}

function isIdentifierStartCharacter(character: string | undefined): boolean {
  return character !== undefined && (character === '$' || character === '_' || /^\p{ID_Start}$/u.test(character))
}

function isIdentifierPartCharacter(character: string | undefined): boolean {
  return character !== undefined && (character === '$' || character === '_' || character === '\u200c' || character === '\u200d' || /^\p{ID_Continue}$/u.test(character))
}

function readIdentifierUnit(source: string, start: number): { character: string; next: number } | undefined {
  const escaped = readUnicodeIdentifierEscape(source, start)
  if (escaped !== undefined) return escaped
  const character = source[start]
  if (character === undefined) return undefined
  return { character, next: start + 1 }
}

function isIdentifierStartAt(source: string, start: number): boolean {
  const unit = readIdentifierUnit(source, start)
  return unit !== undefined && isIdentifierStartCharacter(unit.character)
}

function isIdentifierPartAt(source: string, start: number): boolean {
  const unit = readIdentifierUnit(source, start)
  return unit !== undefined && isIdentifierPartCharacter(unit.character)
}

function readIdentifier(source: string, start: number): { value: string; next: number } {
  const first = readIdentifierUnit(source, start)
  assert.ok(first !== undefined && isIdentifierStartCharacter(first.character), 'productive graph contains an invalid identifier')
  let index = first.next
  let value = first.character
  while (isIdentifierPartAt(source, index)) {
    const unit = readIdentifierUnit(source, index)
    assert.ok(unit !== undefined, 'productive graph contains an invalid identifier escape')
    value += unit.character
    index = unit.next
  }
  return { value, next: index }
}

function readQuotedLiteral(source: string, start: number, quote: string): ParsedLiteral {
  let index = start + 1
  let value = ''

  while (index < source.length) {
    const character = source[index]

    if (character === quote) return { value, next: index + 1 }
    if (quote === templateQuote && character === '$' && source[index + 1] === '{') {
      assert.fail('productive graph must not hide imports behind computed specifiers')
    }
    if (quote !== templateQuote && isLineTerminator(character)) {
      assert.fail('productive graph contains an unterminated string literal')
    }

    if (character !== '\\') {
      value += character
      index += 1
      continue
    }

    index += 1
    assert.equal(index < source.length, true, 'productive graph contains an unterminated escape')
    const escaped = source[index]

    if (isLineTerminator(escaped)) {
      if (escaped === '\r' && source[index + 1] === '\n') index += 2
      else index += 1
      continue
    }

    const simpleEscapes: Record<string, string> = {
      b: '\b',
      f: '\f',
      n: '\n',
      r: '\r',
      t: '\t',
      v: '\v',
      '0': '\0',
    }
    if (simpleEscapes[escaped] !== undefined) {
      value += simpleEscapes[escaped]
      index += 1
      continue
    }

    if (escaped === 'x') {
      const parsed = readFixedHexEscape(source, index + 1, 2)
      assert.ok(parsed !== undefined, 'productive graph contains an invalid hexadecimal escape')
      value += parsed.character
      index = parsed.next
      continue
    }

    if (escaped === 'u') {
      if (source[index + 1] === '{') {
        const close = source.indexOf('}', index + 2)
        assert.notEqual(close, -1, 'productive graph contains an unterminated Unicode code-point escape')
        const digits = source.slice(index + 2, close)
        assert.ok(digits.length > 0, 'productive graph contains an empty Unicode code-point escape')
        let codePoint = 0
        for (const digitCharacter of digits) {
          const digit = hexValue(digitCharacter)
          assert.ok(digit !== undefined, 'productive graph contains an invalid Unicode code-point escape')
          codePoint = codePoint * 16 + digit
        }
        assert.ok(codePoint <= 0x10ffff, 'productive graph contains an out-of-range Unicode code point')
        assert.ok(!(codePoint >= 0xd800 && codePoint <= 0xdfff), 'productive graph contains a surrogate code point')
        value += String.fromCodePoint(codePoint)
        index = close + 1
        continue
      }

      const parsed = readFixedHexEscape(source, index + 1, 4)
      assert.ok(parsed !== undefined, 'productive graph contains an invalid Unicode escape')
      value += parsed.character
      index = parsed.next
      continue
    }

    value += escaped
    index += 1
  }

  assert.fail('productive graph contains an unterminated quoted literal')
}

const regexPrefixKeywords = new Set([
  'await',
  'case',
  'delete',
  'do',
  'else',
  'extends',
  'in',
  'instanceof',
  'new',
  'return',
  'throw',
  'typeof',
  'void',
  'yield',
])

const regexControlParenKeywords = new Set([
  'catch',
  'for',
  'if',
  'switch',
  'while',
  'with',
])

function readRegexLiteral(source: string, start: number): { next: number } {
  let index = start + 1
  let inCharacterClass = false

  while (index < source.length) {
    const character = source[index]
    assert.equal(isLineTerminator(character), false, 'productive graph contains an unterminated regular expression')

    if (character === '\\') {
      index += 1
      assert.equal(index < source.length, true, 'productive graph contains an unterminated regular expression escape')
      assert.equal(isLineTerminator(source[index]), false, 'productive graph contains an invalid regular expression escape')
      index += 1
      continue
    }

    if (character === '[') inCharacterClass = true
    else if (character === ']') inCharacterClass = false
    else if (character === '/' && !inCharacterClass) {
      index += 1
      while (isIdentifierPartAt(source, index)) index = readIdentifierUnit(source, index)!.next
      return { next: index }
    }

    index += 1
  }

  assert.fail('productive graph contains an unterminated regular expression')
}

function readNumericLiteral(source: string, start: number): number {
  let index = start
  while (index < source.length && /[A-Za-z0-9_.$]/.test(source[index])) index += 1
  return index
}

function regexMayStartAfterIdentifier(value: string): boolean {
  return regexPrefixKeywords.has(value)
}

function regexMayStartAfterPunctuation(character: string | undefined): boolean {
  return character !== undefined && '([{,:;=!?~+-*%&|^<>'.includes(character)
}

function findBalancedExpressionEnd(source: string, start: number): number {
  let depth = 1
  let index = start
  let canStartRegex = true
  const parenthesisContexts: boolean[] = []
  let pendingControlParen = false

  while (index < source.length) {
    index = skipTrivia(source, index)
    assert.equal(index < source.length, true, 'productive graph contains an unterminated template expression')
    const character = source[index]

    if (character === "'" || character === '"' || character === templateQuote) {
      if (character === templateQuote) index = readTemplateForScanning(source, index).next
      else index = readQuotedLiteral(source, index, character).next
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (character === '/' && canStartRegex) {
      index = readRegexLiteral(source, index).next
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (character === '/') {
      index += 1
      canStartRegex = true
      pendingControlParen = false
      continue
    }

    if ((character === '+' || character === '-') && source[index + 1] === character) {
      index += 2
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (isIdentifierStartAt(source, index)) {
      const token = readIdentifier(source, index)
      index = token.next
      canStartRegex = regexMayStartAfterIdentifier(token.value)
      pendingControlParen = regexControlParenKeywords.has(token.value)
      continue
    }

    if (/[0-9]/.test(character)) {
      index = readNumericLiteral(source, index)
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (character === '{') {
      depth += 1
      index += 1
      canStartRegex = true
      pendingControlParen = false
      continue
    }

    if (character === '}') {
      depth -= 1
      if (depth === 0) return index + 1
      index += 1
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (character === '(') {
      parenthesisContexts.push(pendingControlParen)
      pendingControlParen = false
      canStartRegex = true
    } else if (character === ')') {
      canStartRegex = parenthesisContexts.pop() ?? false
      pendingControlParen = false
    } else if (character === ']') {
      canStartRegex = false
      pendingControlParen = false
    } else {
      canStartRegex = regexMayStartAfterPunctuation(character)
      pendingControlParen = false
    }
    index += 1
  }

  assert.fail('productive graph contains an unterminated template expression')
}

function readTemplateForScanning(source: string, start: number): ScannedTemplate {
  const expressions: string[] = []
  let index = start + 1

  while (index < source.length) {
    const character = source[index]
    if (character === templateQuote) return { expressions, next: index + 1 }

    if (character === '\\') {
      index += 1
      if (isLineTerminator(source[index])) {
        if (source[index] === '\r' && source[index + 1] === '\n') index += 2
        else index += 1
      } else {
        index += 1
      }
      continue
    }

    if (character === '$' && source[index + 1] === '{') {
      const end = findBalancedExpressionEnd(source, index + 2)
      expressions.push(source.slice(index + 2, end - 1))
      index = end
      continue
    }

    index += 1
  }

  assert.fail('productive graph contains an unterminated template literal')
}

function readLiteralExpression(source: string, start: number): ParsedLiteral {
  const index = skipTrivia(source, start)
  const character = source[index]

  if (character === "'" || character === '"' || character === templateQuote) {
    if (character === templateQuote) return readQuotedLiteral(source, index, templateQuote)
    return readQuotedLiteral(source, index, character)
  }

  if (character === '(') {
    const nested = readLiteralExpression(source, index + 1)
    const close = skipTrivia(source, nested.next)
    assert.ok(source[close] === ')', 'productive graph must not hide imports behind computed specifiers')
    return { value: nested.value, next: close + 1 }
  }

  assert.fail('productive graph must not hide imports behind computed specifiers')
}

function readStaticModuleSpecifier(source: string, start: number): ParsedLiteral | undefined {
  let index = skipTrivia(source, start)
  if (source[index] === "'" || source[index] === '"') return readQuotedLiteral(source, index, source[index])

  while (index < source.length) {
    index = skipTrivia(source, index)
    if (index >= source.length || source[index] === ';') return undefined

    const character = source[index]
    if (character === "'" || character === '"') return undefined
    if (isIdentifierStartAt(source, index)) {
      const token = readIdentifier(source, index)
      if (token.value === 'from') {
        const specifierStart = skipTrivia(source, token.next)
        if (source[specifierStart] === "'" || source[specifierStart] === '"') {
          return readQuotedLiteral(source, specifierStart, source[specifierStart])
        }
      }
      index = token.next
      continue
    }

    index += 1
  }

  return undefined
}

function importSpecifiers(source: string): string[] {
  const specifiers = new Set<string>()
  // CommonJS loaders created by node:module/createRequire are valid module
  // edges too. Keep the guard fail-closed for both the conventional `require`
  // binding and aliases assigned from createRequire(...), while still ignoring
  // member calls such as obj.require(...).
  const indirectLoaderNames = new Set(['require'])
  let index = 0
  let canStartRegex = true
  const parenthesisContexts: boolean[] = []
  let pendingControlParen = false

  while (index < source.length) {
    index = skipTrivia(source, index)
    if (index >= source.length) break

    const character = source[index]
    if (character === "'" || character === '"') {
      index = readQuotedLiteral(source, index, character).next
      canStartRegex = false
      pendingControlParen = false
      continue
    }
    if (character === templateQuote) {
      const template = readTemplateForScanning(source, index)
      for (const expression of template.expressions) {
        for (const specifier of importSpecifiers(expression)) specifiers.add(specifier)
      }
      index = template.next
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (character === '/' && canStartRegex) {
      index = readRegexLiteral(source, index).next
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (character === '/') {
      index += 1
      canStartRegex = true
      pendingControlParen = false
      continue
    }

    if ((character === '+' || character === '-') && source[index + 1] === character) {
      index += 2
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (/[0-9]/.test(character)) {
      index = readNumericLiteral(source, index)
      canStartRegex = false
      pendingControlParen = false
      continue
    }

    if (!isIdentifierStartAt(source, index)) {
      if (character === '(') {
        parenthesisContexts.push(pendingControlParen)
        pendingControlParen = false
        canStartRegex = true
      } else if (character === ')') {
        canStartRegex = parenthesisContexts.pop() ?? false
        pendingControlParen = false
      } else {
        canStartRegex = regexMayStartAfterPunctuation(character)
        pendingControlParen = false
      }
      index += 1
      continue
    }

    const tokenStart = index
    const token = readIdentifier(source, index)
    if (token.value === 'createRequire') {
      const prefix = source.slice(0, tokenStart)
      const binding = /(?:^|[;{}])\s*(?:const|let|var)\s+([\$A-Za-z_][\$A-Za-z0-9_]*)\s*=\s*(?:await\s+)?(?:[\$A-Za-z_][\$A-Za-z0-9_]*\.)?$/.exec(prefix)
      if (binding) indirectLoaderNames.add(binding[1])
    }
    if (indirectLoaderNames.has(token.value) && !isMemberAccessBefore(source, tokenStart)) {
      const callStart = skipTrivia(source, token.next)
      if (source[callStart] === '(') {
        const argument = readLiteralExpression(source, callStart + 1)
        const argumentEnd = skipTrivia(source, argument.next)
        assert.equal(
          source[argumentEnd] === ')',
          true,
          'productive graph must not hide indirect module loads behind computed specifiers',
        )
        specifiers.add(argument.value)
        index = argumentEnd + 1
        canStartRegex = false
        pendingControlParen = false
        continue
      }
    }
    if (token.value === 'import') {
      const next = skipTrivia(source, token.next)
      if (source[next] === '(' && !isMemberAccessBefore(source, index)) {
        const argument = readLiteralExpression(source, next + 1)
        const argumentEnd = skipTrivia(source, argument.next)
        assert.ok(
          source[argumentEnd] === ')' || source[argumentEnd] === ',',
          'productive graph must not hide imports behind computed specifiers',
        )
        specifiers.add(argument.value)
        index = source[argumentEnd] === ')' ? argumentEnd + 1 : argument.next
        canStartRegex = false
        pendingControlParen = false
        continue
      }
      const staticSpecifier = readStaticModuleSpecifier(source, token.next)
      if (staticSpecifier !== undefined) {
        specifiers.add(staticSpecifier.value)
        index = staticSpecifier.next
        canStartRegex = false
        pendingControlParen = false
        continue
      }
    } else if (token.value === 'export') {
      const staticSpecifier = readStaticModuleSpecifier(source, token.next)
      if (staticSpecifier !== undefined) {
        specifiers.add(staticSpecifier.value)
        index = staticSpecifier.next
        canStartRegex = false
        pendingControlParen = false
        continue
      }
    }

    canStartRegex = regexMayStartAfterIdentifier(token.value)
    pendingControlParen = regexControlParenKeywords.has(token.value)
    index = token.next
  }

  return [...specifiers]
}

function resolveProductiveModule(sourceFile: string, specifier: string): string {
  const candidate = resolve(dirname(sourceFile), specifier.replace(/\.js$/, '.ts'))
  assert.equal(existsSync(candidate), true, `unresolved productive import ${specifier} from ${sourceFile}`)
  assert.equal(
    candidate === productiveSourceRoot || candidate.startsWith(`${productiveSourceRoot}${sep}`),
    true,
    `productive import escapes src/: ${sourceFile} -> ${specifier}`,
  )
  return candidate
}

function assertProductiveImportGraph(entryPoint: string, visited = new Set<string>()): void {
  if (visited.has(entryPoint)) return
  visited.add(entryPoint)
  const source = readFileSync(entryPoint, 'utf8')

  for (const specifier of importSpecifiers(source)) {
    assert.doesNotMatch(specifier, forbiddenProductiveDependency, `${entryPoint} imports forbidden dependency ${specifier}`)
    if (specifier.startsWith('.')) {
      assertProductiveImportGraph(resolveProductiveModule(entryPoint, specifier), visited)
    }
  }
}

test('T3-AC1-P/N keeps decision and realization lifecycles independent', () => {
  const proposed = AdrRecord.create({
    reference: reference(),
    contentHash: 'sha256:adr-v1',
    decisionStatus: 'PROPOSED',
    realizationStatus: 'UNPROCESSED',
    derivedEligibility: DerivedEligibility.invalidated('not accepted'),
  })
  const accepted = proposed.transitionDecision('ACCEPTED')
  const processing = accepted.beginProcessing()

  assert.equal(accepted.decisionStatus.value, 'ACCEPTED')
  assert.equal(accepted.derivedEligibility.status, 'ELIGIBLE')
  assert.equal(accepted.realizationStatus.value, 'UNPROCESSED')
  assert.equal(processing.decisionStatus.value, 'ACCEPTED')
  assert.equal(processing.realizationStatus.value, 'PROCESSING')
  assert.throws(
    () => processing.transitionDecision('SUPERSEDED'),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'INVALID_ADR_DECISION_TRANSITION',
  )
  assert.equal(proposed.realizationStatus.value, 'UNPROCESSED')

  const processingRemediation = accepted.remediate('sha256:adr-v2')
  assert.equal(processingRemediation.successor.reference.revision.value, 2)

  assert.equal(proposed.transitionDecision('REJECTED').decisionStatus.value, 'REJECTED')
  assert.throws(
    () => AdrRecord.create({
      reference: reference(2),
      contentHash: 'sha256:detached',
      decisionStatus: 'ACCEPTED',
      realizationStatus: 'UNPROCESSED',
      derivedEligibility: DerivedEligibility.eligible(),
    }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_SUCCESSION_INVALID',
  )
  assert.throws(
    () => AdrRecord.create({
      reference: reference(),
      contentHash: 'sha256:invalid-lifecycle',
      decisionStatus: 'PROPOSED',
      realizationStatus: 'IMPLEMENTED',
      derivedEligibility: DerivedEligibility.invalidated('not accepted'),
      operationalRecord: {
        implementationCommitSha: 'commit-1',
        implementedAt: '2026-09-12T10:00:00.000Z',
        evidenceReference: 'evidence/adr-1',
      } as never,
    }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'INVALID_ADR_REALIZATION_STATUS',
  )
})

test('public initial admission rejects post-transition realization states', () => {
  for (const realizationStatus of ['PROCESSING', 'IMPLEMENTED'] as const) {
    assert.throws(
      () => AdrRecord.create({
        reference: reference(),
        contentHash: 'sha256:initial-post-transition',
        decisionStatus: 'ACCEPTED',
        realizationStatus,
        derivedEligibility: DerivedEligibility.eligible(),
        operationalRecord: realizationStatus === 'IMPLEMENTED'
          ? {
              implementationCommitSha: 'commit-1',
              implementedAt: '2026-09-12T10:00:00.000Z',
              evidenceReference: 'evidence/adr-1',
            }
          : undefined,
      }),
      (error: unknown) => error instanceof AdrDomainError && error.code === 'INVALID_ADR_REALIZATION_STATUS',
    )
  }

  const catalog = new AdrAuthorityCatalog()
  const implemented = acceptedAdr().beginProcessing().markImplemented({
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  })
  assert.throws(
    () => catalog.registerInitial(implemented),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'INVALID_ADR_REALIZATION_STATUS',
  )
  assert.equal(catalog.find(implemented.reference), undefined)
})

test('T3-AC2-P creates an immediate reciprocal successor and invalidates prior eligibility', async () => {
  const predecessor = acceptedAdr()
  const repository = new InMemoryAdrRepository()
  repository.seed(predecessor)
  const reader = new SequenceAdrReader(predecessor)
  const result = await new RemediateAdrHandler(repository, reader).handle({
    reference: predecessor.reference,
    nextContentHash: 'sha256:adr-v2',
  })

  assert.equal(result.predecessor.decisionStatus.value, 'SUPERSEDED')
  assert.equal(result.predecessor.derivedEligibility.status, 'INVALIDATED')
  assert.equal(result.successor.reference.revision.value, 2)
  assert.equal(result.successor.contentHash.value, 'sha256:adr-v2')
  assert.equal(result.successor.supersedes?.canonicalKey, predecessor.reference.canonicalKey)
  assert.equal(result.predecessor.supersededBy?.canonicalKey, result.successor.reference.canonicalKey)
  assert.equal(result.succession.predecessor.canonicalKey, result.predecessor.reference.canonicalKey)
  assert.equal(result.succession.successor.canonicalKey, result.successor.reference.canonicalKey)
  assert.equal(repository.find(result.successor.reference)?.contentHash.value, 'sha256:adr-v2')
})

test('T3-AC2-N rejects implemented remediation, duplicate revision, and temporal drift without mutation', async () => {
  const implemented = acceptedAdr().beginProcessing().markImplemented({
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  })
  assert.throws(
    () => implemented.remediate('sha256:adr-v2'),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REMEDIATION_NOT_ALLOWED',
  )
  assert.throws(
    () => implemented.replaceContentHash(),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'IMPLEMENTED_ADR_IMMUTABLE',
  )
  assert.equal(implemented.contentHash.value, 'sha256:adr-v1')

  const processing = acceptedAdr().beginProcessing()
  assert.throws(
    () => processing.remediate('sha256:adr-v2'),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REMEDIATION_NOT_ALLOWED',
  )

  const predecessor = acceptedAdr()
  const repository = new InMemoryAdrRepository()
  repository.seed(predecessor)
  const reader = new SequenceAdrReader(predecessor)
  reader.observations.push(
    observationFromRecord(predecessor),
    Object.freeze({ ...observationFromRecord(predecessor), contentHash: AdrContentHash.create('sha256:adr-drift') }),
  )
  await assert.rejects(
    new RemediateAdrHandler(repository, reader).handle({ reference: predecessor.reference, nextContentHash: 'sha256:adr-v2' }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_DRIFT',
  )
  assert.equal(repository.reserveCalls, 0)
  assert.equal(repository.find(predecessor.reference), predecessor)

  const duplicateRepository = new InMemoryAdrRepository()
  const duplicatePredecessor = acceptedAdr()
  duplicateRepository.seed(duplicatePredecessor)
  const duplicateRemediation = duplicatePredecessor.remediate('sha256:adr-v2')
  const duplicateAuthority = observationFromRecord(duplicatePredecessor)
  const firstReservation = await duplicateRepository.reserveRemediation(duplicateRemediation, duplicateAuthority, reader)
  const secondReservation = await duplicateRepository.reserveRemediation(duplicateRemediation, duplicateAuthority, reader)
  assert.equal(firstReservation.status, 'ACCEPTED')
  assert.equal(secondReservation.status, 'DUPLICATE')
  assert.equal(duplicateRepository.records.size, 2)
})

test('T3-AC3-P/N preserves implemented operational metadata and immutable state', () => {
  const implemented = acceptedAdr().beginProcessing().markImplemented({
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  })
  assert.equal(implemented.realizationStatus.value, 'IMPLEMENTED')
  assert.equal(implemented.operationalRecord?.implementationCommitSha, 'commit-1')
  assert.equal(implemented.operationalRecord?.evidenceReference, 'evidence/adr-1')
  assert.equal(Object.isFrozen(implemented), true)
  assert.equal(Object.isFrozen(implemented.operationalRecord), true)
  assert.throws(() => implemented.markImplemented({
    implementationCommitSha: 'commit-2',
    implementedAt: '2026-09-12T11:00:00.000Z',
    evidenceReference: 'evidence/adr-2',
  }), (error: unknown) => error instanceof AdrDomainError && error.code === 'INVALID_ADR_REALIZATION_TRANSITION')
})

test('T3-AC3-P succeeds an implemented ADR only through a distinct reciprocal successor', () => {
  const implemented = acceptedAdr().beginProcessing().markImplemented({
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  })
  const successorReference = distinctAdrReference()
  const succession = implemented.succeedImplemented(successorReference, 'sha256:adr-0002')

  assert.equal(succession.predecessor.decisionStatus.value, 'SUPERSEDED')
  assert.equal(succession.predecessor.realizationStatus.value, 'IMPLEMENTED')
  assert.equal(succession.predecessor.derivedEligibility.status, 'INVALIDATED')
  assert.equal(succession.predecessor.operationalRecord?.implementationCommitSha, 'commit-1')
  assert.equal(succession.successor.reference.canonicalKey, successorReference.canonicalKey)
  assert.equal(succession.successor.reference.revision.value, 1)
  assert.equal(succession.successor.reference.identity.equals(implemented.reference.identity), false)
  assert.equal(succession.successor.supersedes?.canonicalKey, implemented.reference.canonicalKey)
  assert.equal(succession.predecessor.supersededBy?.canonicalKey, successorReference.canonicalKey)
  assert.equal(succession.succession.predecessor.canonicalKey, implemented.reference.canonicalKey)
  assert.equal(succession.succession.successor.canonicalKey, successorReference.canonicalKey)
  assert.equal(Object.isFrozen(succession.predecessor), true)
  assert.equal(Object.isFrozen(succession.successor), true)

  const history = new Map([
    [succession.predecessor.reference.canonicalKey, succession.predecessor],
    [succession.successor.reference.canonicalKey, succession.successor],
  ])
  const rehydrated = AdrRecord.rehydrate({
    reference: succession.successor.reference,
    contentHash: succession.successor.contentHash,
    decisionStatus: succession.successor.decisionStatus,
    realizationStatus: succession.successor.realizationStatus,
    derivedEligibility: succession.successor.derivedEligibility,
    supersedes: succession.successor.supersedes,
  }, {
    resolveAdrForRehydration(referenceToResolve) {
      const record = history.get(referenceToResolve.canonicalKey)
      if (!record) throw new AdrDomainError('ADR_REVISION_NOT_FOUND', 'missing test history')
      return record
    },
  })
  assert.equal(rehydrated.matchesRecord(succession.successor), true)

  assert.throws(
    () => implemented.succeedImplemented(reference(2), 'sha256:adr-v2'),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_SUCCESSION_INVALID',
  )
  assert.throws(
    () => implemented.succeedImplemented(distinctAdrReference('ADR-0003', 2), 'sha256:adr-0003'),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_SUCCESSION_INVALID',
  )
  assert.throws(
    () => implemented.succeedImplemented(distinctAdrReference('ADR-0004'), 'sha256:adr-v1'),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_SUCCESSION_INVALID',
  )
  assert.equal(implemented.decisionStatus.value, 'ACCEPTED')
  assert.equal(implemented.operationalRecord?.evidenceReference, 'evidence/adr-1')
})

test('implemented ADR succession application path is idempotent and conflict-safe', async () => {
  const implemented = acceptedAdr().beginProcessing().markImplemented({
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  })
  const repository = new InMemoryImplementedSuccessionRepository()
  repository.seed(implemented)
  const reader = new SequenceAdrReader(implemented)
  const handler = new SucceedImplementedAdrHandler(repository, reader)
  const command = {
    reference: implemented.reference,
    successorReference: distinctAdrReference(),
    successorContentHash: 'sha256:adr-0002',
  }

  const first = await handler.handle(command)
  assert.equal(first.predecessor.decisionStatus.value, 'SUPERSEDED')
  assert.equal(first.predecessor.realizationStatus.value, 'IMPLEMENTED')
  assert.equal(repository.reserveCalls, 1)

  const replay = await handler.handle(command)
  assert.equal(replay.successor.reference.canonicalKey, first.successor.reference.canonicalKey)
  assert.equal(repository.reserveCalls, 1)

  await assert.rejects(
    handler.handle({ ...command, successorContentHash: 'sha256:conflicting' }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_DRIFT',
  )
  assert.equal(repository.records.size, 2)
})

test('implemented ADR succession rejects stale authority before reservation', async () => {
  const implemented = acceptedAdr().beginProcessing().markImplemented({
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  })
  const repository = new InMemoryImplementedSuccessionRepository()
  repository.seed(implemented)
  const reader = new SequenceAdrReader(implemented)
  reader.observations.push(Object.freeze({
    ...observationFromRecord(implemented),
    contentHash: AdrContentHash.create('sha256:stale'),
  }))

  await assert.rejects(
    new SucceedImplementedAdrHandler(repository, reader).handle({
      reference: implemented.reference,
      successorReference: distinctAdrReference(),
      successorContentHash: 'sha256:adr-0002',
    }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_DRIFT',
  )
  assert.equal(repository.reserveCalls, 0)
  assert.equal(repository.records.size, 1)
})

test('ADR construction defensively copies nested eligibility and operational values', () => {
  const mutableEligibility = { status: 'ELIGIBLE' } as unknown as DerivedEligibility
  const mutableOperationalRecord = {
    implementationCommitSha: 'commit-1',
    implementedAt: '2026-09-12T10:00:00.000Z',
    evidenceReference: 'evidence/adr-1',
  } as never
  const record = AdrRecord.create({
    reference: reference(),
    contentHash: 'sha256:adr-v1',
    decisionStatus: 'ACCEPTED',
    realizationStatus: 'UNPROCESSED',
    derivedEligibility: mutableEligibility,
  })
  const implemented = record.beginProcessing().markImplemented(mutableOperationalRecord)

  ;(mutableEligibility as unknown as { status: string }).status = 'INVALIDATED'
  ;(mutableOperationalRecord as { implementationCommitSha: string }).implementationCommitSha = 'forged'

  assert.equal(record.derivedEligibility.status, 'ELIGIBLE')
  assert.equal(implemented.operationalRecord?.implementationCommitSha, 'commit-1')
  assert.equal(Object.isFrozen(record.derivedEligibility), true)
  assert.equal(Object.isFrozen(implemented.operationalRecord), true)
})

test('the productive DOM authority catalog returns canonical observations without caller-supplied status', () => {
  const catalog = new AdrAuthorityCatalog()
  const record = acceptedAdr()
  catalog.registerInitial(record)

  const observation = catalog.observe(record.reference)
  assert.equal(observation?.reference.canonicalKey, record.reference.canonicalKey)
  assert.equal(observation?.decisionStatus, 'ACCEPTED')
  assert.equal(observation?.realizationStatus, 'UNPROCESSED')
  assert.equal(observation?.contentHash.value, 'sha256:adr-v1')
})

test('the productive authority catalog owns immutable initial admission state', () => {
  const callerRecord = mutableRecordClone(acceptedAdr())
  const catalog = new AdrAuthorityCatalog()

  catalog.registerInitial(callerRecord)
  const stored = catalog.find(reference())
  assert.ok(stored)
  assert.notEqual(stored, callerRecord)
  assert.equal(Object.isFrozen(stored), true)
  assert.equal(Object.isFrozen(stored.reference), true)
  assert.equal(stored.contentHash.value, 'sha256:adr-v1')

  ;(callerRecord as unknown as { contentHash: AdrContentHash }).contentHash = AdrContentHash.create('sha256:forged')
  ;(callerRecord as unknown as { reference: CanonicalIdentityReference }).reference = reference(2)
  ;(callerRecord as unknown as { supersededBy: CanonicalIdentityReference }).supersededBy = reference(2)
  ;(callerRecord.decisionStatus as unknown as { value: string }).value = 'REJECTED'
  ;(callerRecord.realizationStatus as unknown as { value: string }).value = 'IMPLEMENTED'

  const observed = catalog.observe(reference())
  assert.equal(observed?.contentHash.value, 'sha256:adr-v1')
  assert.equal(observed?.reference.canonicalKey, reference().canonicalKey)
  assert.equal(catalog.find(reference(2)), undefined)
})

test('the productive authority catalog isolates reserved predecessor and successor state', async () => {
  const predecessor = acceptedAdr()
  const canonicalPredecessor = AdrRecord.create(predecessor)
  const remediation = canonicalPredecessor.remediate('sha256:adr-v2')
  const callerPredecessor = mutableRecordClone(remediation.predecessor)
  const callerSuccessor = mutableRecordClone(remediation.successor)
  const callerExpectedPredecessor = mutableRecordClone(remediation.expectedPredecessor)
  const callerRemediation = {
    ...remediation,
    expectedPredecessor: callerExpectedPredecessor,
    predecessor: callerPredecessor,
    successor: callerSuccessor,
  } as AdrRemediation
  const catalog = new AdrAuthorityCatalog({
    beforeReservationCommit: async () => {
      ;(callerPredecessor as unknown as { contentHash: AdrContentHash }).contentHash = AdrContentHash.create('sha256:forged-during-commit')
      ;(callerSuccessor as unknown as { contentHash: AdrContentHash }).contentHash = AdrContentHash.create('sha256:forged-during-commit')
      ;(callerSuccessor as unknown as { reference: CanonicalIdentityReference }).reference = reference(3)
      ;(callerPredecessor.decisionStatus as unknown as { value: string }).value = 'REJECTED'
      ;(callerPredecessor.realizationStatus as unknown as { value: string }).value = 'IMPLEMENTED'
      ;(callerSuccessor.decisionStatus as unknown as { value: string }).value = 'REJECTED'
      ;(callerSuccessor.realizationStatus as unknown as { value: string }).value = 'IMPLEMENTED'
    },
  })
  catalog.registerInitial(predecessor)

  const result = await catalog.reserveRemediation(
    callerRemediation,
    observationFromRecord(canonicalPredecessor),
    catalog,
  )
  assert.equal(result.status, 'ACCEPTED')

  const storedPredecessor = catalog.find(predecessor.reference)
  const storedSuccessor = catalog.find(reference(2))
  assert.ok(storedPredecessor)
  assert.ok(storedSuccessor)
  assert.notEqual(storedPredecessor, callerPredecessor)
  assert.notEqual(storedSuccessor, callerSuccessor)
  assert.equal(result.remediation.predecessor, storedPredecessor)
  assert.equal(result.remediation.successor, storedSuccessor)
  assert.equal(Object.isFrozen(storedPredecessor), true)
  assert.equal(Object.isFrozen(storedSuccessor), true)
  assert.equal(storedPredecessor.contentHash.value, 'sha256:adr-v1')
  assert.equal(storedSuccessor.contentHash.value, 'sha256:adr-v2')

  ;(callerPredecessor as unknown as { contentHash: AdrContentHash }).contentHash = AdrContentHash.create('sha256:forged-predecessor')
  ;(callerPredecessor as unknown as { supersededBy: CanonicalIdentityReference }).supersededBy = reference(3)
  ;(callerSuccessor as unknown as { contentHash: AdrContentHash }).contentHash = AdrContentHash.create('sha256:forged-successor')
  ;(callerSuccessor as unknown as { supersedes: CanonicalIdentityReference }).supersedes = reference(3)
  ;(callerSuccessor as unknown as { reference: CanonicalIdentityReference }).reference = reference(3)
  ;(callerPredecessor.decisionStatus as unknown as { value: string }).value = 'ACCEPTED'
  ;(callerPredecessor.realizationStatus as unknown as { value: string }).value = 'UNPROCESSED'
  ;(callerSuccessor.decisionStatus as unknown as { value: string }).value = 'ACCEPTED'
  ;(callerSuccessor.realizationStatus as unknown as { value: string }).value = 'UNPROCESSED'
  ;(callerRemediation as unknown as { successor: AdrRecord }).successor = callerSuccessor

  assert.equal(catalog.find(predecessor.reference)?.contentHash.value, 'sha256:adr-v1')
  assert.equal(catalog.find(predecessor.reference)?.supersededBy?.canonicalKey, reference(2).canonicalKey)
  assert.equal(catalog.find(reference(2))?.contentHash.value, 'sha256:adr-v2')
  assert.equal(catalog.find(reference(2))?.supersedes?.canonicalKey, predecessor.reference.canonicalKey)
  assert.equal(catalog.find(reference(3)), undefined)
})

test('ReadAdrAuthorityHandler exposes canonical observations and not-found semantics directly', () => {
  const catalog = new AdrAuthorityCatalog()
  const record = acceptedAdr()
  catalog.registerInitial(record)
  const handler = new ReadAdrAuthorityHandler(catalog)

  const observation = handler.handle({ reference: record.reference })
  assert.equal(observation.reference.canonicalKey, record.reference.canonicalKey)
  assert.equal(observation.decisionStatus, 'ACCEPTED')
  assert.equal(observation.realizationStatus, 'UNPROCESSED')
  assert.equal(observation.contentHash.value, 'sha256:adr-v1')
  assert.throws(
    () => handler.handle({ reference: reference(2) }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_NOT_FOUND',
  )
})

test('rehydration consumes the exact canonical ADR record and complete reciprocal history', async () => {
  const predecessor = acceptedAdr()
  const catalog = new AdrAuthorityCatalog()
  catalog.registerInitial(predecessor)
  const remediation = predecessor.remediate('sha256:adr-v2')
  await catalog.reserveRemediation(remediation, observationFromRecord(predecessor), catalog)

  const rehydrated = AdrRecord.rehydrate({
    reference: remediation.successor.reference,
    contentHash: remediation.successor.contentHash,
    decisionStatus: remediation.successor.decisionStatus,
    realizationStatus: remediation.successor.realizationStatus,
    derivedEligibility: remediation.successor.derivedEligibility,
    supersedes: remediation.successor.supersedes,
  }, catalog)
  assert.notEqual(rehydrated, remediation.successor)
  assert.equal(rehydrated.matchesRecord(remediation.successor), true)
  assert.equal(rehydrated.contentHash.value, 'sha256:adr-v2')

  assert.throws(
    () => AdrRecord.rehydrate({
      reference: remediation.successor.reference,
      contentHash: 'sha256:FORGED',
      decisionStatus: 'ACCEPTED',
      realizationStatus: 'UNPROCESSED',
      derivedEligibility: remediation.successor.derivedEligibility,
      supersedes: predecessor.reference,
    }, catalog),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REHYDRATION_MISMATCH',
  )

  assert.throws(
    () => AdrRecord.rehydrate({
      reference: remediation.successor.reference,
      contentHash: remediation.successor.contentHash,
      decisionStatus: 'REJECTED',
      realizationStatus: 'UNPROCESSED',
      derivedEligibility: DerivedEligibility.invalidated('forged rejection'),
      supersedes: predecessor.reference,
    }, catalog),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REHYDRATION_MISMATCH',
  )

  const detachedCatalog = new AdrAuthorityCatalog()
  assert.throws(
    () => detachedCatalog.resolveAdrForRehydration(remediation.successor.reference),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REVISION_NOT_FOUND',
  )
  assert.throws(
    () => AdrRecord.rehydrate({
      reference: remediation.successor.reference,
      contentHash: remediation.successor.contentHash,
      decisionStatus: remediation.successor.decisionStatus,
      realizationStatus: remediation.successor.realizationStatus,
      derivedEligibility: remediation.successor.derivedEligibility,
      supersedes: predecessor.reference,
    }, detachedCatalog),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REVISION_NOT_FOUND',
  )
})

test('ADR reservation requires the canonical predecessor and preserves it on conflict', async () => {
  const predecessor = acceptedAdr()
  const remediation = predecessor.remediate('sha256:adr-v2')
  const detachedCatalog = new AdrAuthorityCatalog()
  await assert.rejects(
    detachedCatalog.reserveRemediation(remediation, observationFromRecord(predecessor), detachedCatalog),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REVISION_NOT_FOUND',
  )
  assert.equal(detachedCatalog.find(predecessor.reference), undefined)

  const catalog = new AdrAuthorityCatalog()
  catalog.registerInitial(predecessor)
  const accepted = await catalog.reserveRemediation(remediation, observationFromRecord(predecessor), catalog)
  assert.equal(accepted.status, 'ACCEPTED')
  const replay = await catalog.reserveRemediation(remediation, observationFromRecord(predecessor), catalog)
  assert.equal(replay.status, 'DUPLICATE')

  const conflictCatalog = new AdrAuthorityCatalog()
  conflictCatalog.registerInitial(predecessor)
  const forgedPredecessor = AdrRecord.create({
    reference: predecessor.reference,
    contentHash: 'sha256:forged-predecessor',
    decisionStatus: predecessor.decisionStatus,
    realizationStatus: predecessor.realizationStatus,
    derivedEligibility: predecessor.derivedEligibility,
  })
  const forgedRemediation = forgedPredecessor.remediate('sha256:adr-v2')
  await assert.rejects(
    conflictCatalog.reserveRemediation(forgedRemediation, observationFromRecord(predecessor), conflictCatalog),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_DRIFT',
  )
  assert.equal(conflictCatalog.find(predecessor.reference)?.contentHash.value, 'sha256:adr-v1')
  assert.equal(conflictCatalog.find(forgedRemediation.successor.reference), undefined)
})

test('exact application replay returns the existing immutable successor and rejects a conflicting basis', async () => {
  const predecessor = acceptedAdr()
  const catalog = new AdrAuthorityCatalog()
  catalog.registerInitial(predecessor)
  const handler = new RemediateAdrHandler(catalog, catalog)
  const command = { reference: predecessor.reference, nextContentHash: 'sha256:adr-v2' }

  const first = await handler.handle(command)
  const replay = await handler.handle(command)

  assert.equal(replay.successor, first.successor)
  assert.equal(replay.successor.reference.canonicalKey, reference(2).canonicalKey)
  assert.equal(catalog.find(reference(2)), first.successor)
  await assert.rejects(
    handler.handle({ ...command, nextContentHash: 'sha256:adr-v3' }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_DRIFT',
  )
  assert.equal(catalog.records.size, 2)
})

test('ADR reservation couples the final authority observation to the commit point', async () => {
  const predecessor = acceptedAdr()
  const catalog = new AdrAuthorityCatalog()
  catalog.registerInitial(predecessor)
  const reader = new SequenceAdrReader(predecessor)
  reader.observations.push(
    observationFromRecord(predecessor),
    observationFromRecord(predecessor),
    Object.freeze({
      ...observationFromRecord(predecessor),
      contentHash: AdrContentHash.create('sha256:external-drift'),
    }),
  )

  await assert.rejects(
    new RemediateAdrHandler(catalog, reader).handle({
      reference: predecessor.reference,
      nextContentHash: 'sha256:adr-v2',
    }),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_AUTHORITY_DRIFT',
  )
  assert.equal(catalog.find(predecessor.reference)?.matchesRecord(predecessor), true)
  assert.equal(catalog.find(reference(2)), undefined)
})

test('concurrent equivalent reservations yield one winner and duplicate replay, while conflicts fail closed', async () => {
  const predecessor = acceptedAdr()
  const expectedAuthority = observationFromRecord(predecessor)
  const equivalentCatalog = new AdrAuthorityCatalog()
  equivalentCatalog.registerInitial(predecessor)
  const equivalentA = predecessor.remediate('sha256:adr-v2')
  const equivalentB = predecessor.remediate('sha256:adr-v2')
  const equivalentResults = await Promise.all([
    equivalentCatalog.reserveRemediation(equivalentA, expectedAuthority, equivalentCatalog),
    equivalentCatalog.reserveRemediation(equivalentB, expectedAuthority, equivalentCatalog),
  ])
  assert.deepEqual(equivalentResults.map((result) => result.status).sort(), ['ACCEPTED', 'DUPLICATE'])
  assert.equal(equivalentCatalog.records.size, 2)

  const conflictCatalog = new AdrAuthorityCatalog()
  conflictCatalog.registerInitial(predecessor)
  const conflictA = predecessor.remediate('sha256:adr-v2')
  const conflictB = predecessor.remediate('sha256:adr-v3')
  const conflictResults = await Promise.allSettled([
    conflictCatalog.reserveRemediation(conflictA, expectedAuthority, conflictCatalog),
    conflictCatalog.reserveRemediation(conflictB, expectedAuthority, conflictCatalog),
  ])
  assert.equal(conflictResults.filter((result) => result.status === 'fulfilled').length, 1)
  assert.equal(conflictResults.filter((result) => result.status === 'rejected').length, 1)
  const rejected = conflictResults.find((result) => result.status === 'rejected')
  assert.equal((rejected as PromiseRejectedResult).reason.code, 'ADR_AUTHORITY_DRIFT')
  assert.equal(conflictCatalog.records.size, 2)
  assert.equal(conflictCatalog.find(predecessor.reference)?.contentHash.value, 'sha256:adr-v1')
})

test('T003 executable architecture guard preserves injected domain and application boundaries', async () => {
  const predecessor = acceptedAdr()
  const repository = new InMemoryAdrRepository()
  repository.seed(predecessor)
  const reader = new SequenceAdrReader(predecessor)
  const result = await new RemediateAdrHandler(repository, reader).handle({
    reference: predecessor.reference,
    nextContentHash: 'sha256:adr-v2',
  })

  assert.equal(repository.reserveCalls, 1)
  assert.equal(result.predecessor.reference.canonicalKey, predecessor.reference.canonicalKey)
  assert.equal(result.successor.reference.revision.value, 2)
  assert.equal(repository.find(result.successor.reference), result.successor)
  assert.equal(Object.isFrozen(result.successor), true)
})

test('T003 executable architecture guard rejects forbidden direct and transitive imports', () => {
  const visited = new Set<string>()
  for (const entryPoint of architectureEntryPoints) assertProductiveImportGraph(entryPoint, visited)

  assert.deepEqual(
    [...visited].map((file) => relative(repositoryRoot, file).replaceAll('\\', '/')).sort(),
    ['src/application/adr.ts', 'src/domain/adr.ts', 'src/domain/identity.ts'],
  )
})

test('T003 executable architecture guard rejects valid-syntax import escapes', () => {
  const assertForbiddenLiteral = (source: string): void => {
    const specifiers = importSpecifiers(source)
    assert.equal(specifiers.includes('prototype/forbidden'), true, source)
    assert.throws(
      () => {
        for (const specifier of specifiers) {
          assert.doesNotMatch(
            specifier,
            forbiddenProductiveDependency,
            'synthetic source imports forbidden dependency ' + specifier,
          )
        }
      },
      /imports forbidden dependency/,
    )
  }

  const forbiddenLiteralImportVariants = [
    "await import('prototype/forbidden', { with: { type: 'json' } })",
    "await import /* c */ ('prototype/forbidden', {})",
    "await import(/* c */ 'prototype/forbidden')",
    "await import // comment\r('prototype/forbidden')",
    "await import // comment\u2028('prototype/forbidden')",
    "await import('prototyp\\u0065/forbidden')",
    "await import((( 'prototype/forbidden' )))",
    'await import(' + templateQuote + 'prototype/forbidden' + templateQuote + ')',
    "await \\u0069mport('prototype/forbidden')",
  ]

  for (const source of forbiddenLiteralImportVariants) assertForbiddenLiteral(source)

  assertForbiddenLiteral("import('./safe', { loader: import('prototype/forbidden') })")

  assert.deepEqual(
    importSpecifiers("const pattern = /import\\('prototype\\/forbidden'\\)/"),
    [],
  )

  assert.deepEqual(
    importSpecifiers("const pattern = input / /import\\('prototype\\/forbidden'\\)/.test(input)"),
    [],
  )
  assert.deepEqual(
    importSpecifiers("if (input) /import\\('prototype\\/forbidden'\\)/.test(input)"),
    [],
  )
  assertForbiddenLiteral("counter++ / import('prototype/forbidden') / denominator")

  const templateWithRegexAfterDivision =
    'const value = ' +
    templateQuote +
    "${input / /import\\('prototype\\/forbidden'\\)/.test(input) ? input : input}" +
    templateQuote
  assert.deepEqual(importSpecifiers(templateWithRegexAfterDivision), [])

  const templateWithRegexAfterDivisionAndImport =
    'const value = ' +
    templateQuote +
    "${input / /safe/.test(input) ? import('prototype/forbidden') : null}" +
    templateQuote
  assertForbiddenLiteral(templateWithRegexAfterDivisionAndImport)

  const templateWithRegexBracesAndImport =
    'const value = ' +
    templateQuote +
    "${input / /[{}]/.test(input) ? input : import('prototype/forbidden')}" +
    templateQuote
  assertForbiddenLiteral(templateWithRegexBracesAndImport)

  const templateWithRegexAndImports =
    'const value = ' +
    templateQuote +
    "${/import\\('prototype\\/forbidden'\\)/.test(input) ? import('prototype/forbidden') : import(moduleName)}" +
    templateQuote
  assert.throws(
    () => importSpecifiers(templateWithRegexAndImports),
    /productive graph must not hide imports behind computed specifiers/,
  )

  const computedDynamicImportVariants = [
    'await import(moduleName, { with: { type: "json" } })',
    'await import /* c */ (moduleName, {})',
    'await import // comment\r(moduleName)',
    'await import // comment\u2028(moduleName)',
    'await import((moduleName))',
    "await import('safe' + moduleName)",
    "await import('safe' + 'prototype/forbidden')",
    "await import(/* c */ 'safe' /* c */ + moduleName)",
    "await import(('safe' + moduleName))",
    'await import(' + templateQuote + 'safe${moduleName}' + templateQuote + ')',
    "await \\u0069mport(moduleName)",
  ]

  for (const source of computedDynamicImportVariants) {
    assert.throws(
      () => importSpecifiers(source),
      /productive graph must not hide imports behind computed specifiers/,
    )
  }

  assert.throws(
    () => importSpecifiers('const pattern = /unterminated'),
    /productive graph contains an unterminated regular expression/,
  )

  const aliasedStaticImportSpecifiers = importSpecifiers(
    "import { value as alias } from 'prototype/forbidden'; export { alias as value } from './safe'",
  )
  assert.deepEqual(aliasedStaticImportSpecifiers, ['prototype/forbidden', './safe'])
  assertForbiddenLiteral("import { value as alias } from 'prototype/forbidden'")

  const safeMemberCallSources = [
    "obj.import('prototype/forbidden')",
    "obj?.import('prototype/forbidden')",
    "this.import('prototype/forbidden')",
    "const obj = { import: (value) => value }; obj.import('prototype/forbidden')",
  ]
  for (const source of safeMemberCallSources) assert.deepEqual(importSpecifiers(source), [], source)

  assertForbiddenLiteral("import { createRequire } from 'node:module'; const require = createRequire(import.meta.url); require('prototype/forbidden')")
  assertForbiddenLiteral("import { createRequire } from 'node:module'; const load = createRequire(import.meta.url); load('prototype/forbidden')")
  assertForbiddenLiteral("import * as module from 'node:module'; const load = module.createRequire(import.meta.url); load('prototype/forbidden')")
  assert.throws(
    () => importSpecifiers("import { createRequire } from 'node:module'; const load = createRequire(import.meta.url); load(moduleName)"),
    /computed specifiers/,
  )
})

test('the productive authority catalog rejects initial revision overwrites', () => {
  const predecessor = acceptedAdr()
  const catalog = new AdrAuthorityCatalog()
  catalog.registerInitial(predecessor)
  assert.throws(
    () => catalog.registerInitial(acceptedAdr()),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_REVISION_ALREADY_EXISTS',
  )
  assert.equal(catalog.find(predecessor.reference)?.matchesRecord(predecessor), true)
})

test('the productive authority catalog rejects detached initial successor lineage', () => {
  const predecessor = acceptedAdr()
  const detachedSuperseded = predecessor.remediate('sha256:adr-v2').predecessor
  const catalog = new AdrAuthorityCatalog()

  assert.throws(
    () => catalog.registerInitial(detachedSuperseded),
    (error: unknown) => error instanceof AdrDomainError && error.code === 'ADR_SUCCESSION_INVALID',
  )
  assert.equal(catalog.find(predecessor.reference), undefined)
})

class ReservationInterleavingGate {
  private entered = 0
  private readonly allEntered: Promise<void>
  private releaseAll!: () => void

  constructor(private readonly participants: number) {
    this.allEntered = new Promise<void>((resolve) => {
      this.releaseAll = resolve
    })
  }

  get participantsEntered(): number {
    return this.entered
  }

  async pauseUntilAllParticipantsEnter(): Promise<void> {
    this.entered += 1
    if (this.entered === this.participants) this.releaseAll()
    await this.allEntered
  }
}

test('controlled reservation interleaving preserves one-winner and conflict semantics', async () => {
  const predecessor = acceptedAdr()
  const expectedAuthority = observationFromRecord(predecessor)
  const equivalentGate = new ReservationInterleavingGate(2)
  const equivalentCatalog = new AdrAuthorityCatalog({
    beforeReservationCommit: () => equivalentGate.pauseUntilAllParticipantsEnter(),
  })
  equivalentCatalog.registerInitial(predecessor)

  const equivalentResults = await Promise.all([
    equivalentCatalog.reserveRemediation(predecessor.remediate('sha256:adr-v2'), expectedAuthority, equivalentCatalog),
    equivalentCatalog.reserveRemediation(predecessor.remediate('sha256:adr-v2'), expectedAuthority, equivalentCatalog),
  ])

  assert.equal(equivalentGate.participantsEntered, 2)
  assert.deepEqual(equivalentResults.map((result) => result.status).sort(), ['ACCEPTED', 'DUPLICATE'])
  assert.equal(equivalentCatalog.records.size, 2)

  const conflictGate = new ReservationInterleavingGate(2)
  const conflictCatalog = new AdrAuthorityCatalog({
    beforeReservationCommit: () => conflictGate.pauseUntilAllParticipantsEnter(),
  })
  conflictCatalog.registerInitial(predecessor)
  const conflictResults = await Promise.allSettled([
    conflictCatalog.reserveRemediation(predecessor.remediate('sha256:adr-v2'), expectedAuthority, conflictCatalog),
    conflictCatalog.reserveRemediation(predecessor.remediate('sha256:adr-v3'), expectedAuthority, conflictCatalog),
  ])

  assert.equal(conflictGate.participantsEntered, 2)
  assert.equal(conflictResults.filter((result) => result.status === 'fulfilled').length, 1)
  assert.equal(conflictResults.filter((result) => result.status === 'rejected').length, 1)
  const rejected = conflictResults.find((result) => result.status === 'rejected')
  assert.equal((rejected as PromiseRejectedResult).reason.code, 'ADR_AUTHORITY_DRIFT')
  assert.equal(conflictCatalog.records.size, 2)
  assert.equal(conflictCatalog.find(predecessor.reference)?.contentHash.value, 'sha256:adr-v1')
})
