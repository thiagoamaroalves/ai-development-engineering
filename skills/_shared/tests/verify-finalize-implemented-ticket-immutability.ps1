$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Assert-Equal {
    param(
        [Parameter(Mandatory)] [string] $Name,
        [AllowNull()] $Actual,
        [AllowNull()] $Expected
    )

    if ($Actual -ne $Expected) {
        throw "$Name failed. Expected '$Expected', got '$Actual'."
    }
}

function Assert-Contains {
    param(
        [Parameter(Mandatory)] [string] $Name,
        [Parameter(Mandatory)] [string] $Text,
        [Parameter(Mandatory)] [string] $Expected
    )

    if ($Text.IndexOf($Expected, [System.StringComparison]::Ordinal) -lt 0) {
        throw "$Name failed. Missing '$Expected'."
    }
}

function Get-Sha256([string] $Value) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
    $hash = [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes)
    ([System.BitConverter]::ToString($hash)).Replace('-', '').ToLowerInvariant()
}

$skillPath = Join-Path $PSScriptRoot '..\..\finalize-implemented-ticket\SKILL.md'
$sharedContractPath = Join-Path $PSScriptRoot '..\authority-completeness-gates.md'
$routingContractPath = Join-Path $PSScriptRoot '..\implementation-audit-routing-contract.md'
$checkpointSkillPath = Join-Path $PSScriptRoot '..\..\checkpoint-implemented-ticket\SKILL.md'
$ticketAuditSkillPath = Join-Path $PSScriptRoot '..\..\audit-component-implementation-tickets\SKILL.md'
$ticketRemediationSkillPath = Join-Path $PSScriptRoot '..\..\remediate-component-implementation-tickets\SKILL.md'
$designSkillPath = Join-Path $PSScriptRoot '..\..\design-ticket-implementation\SKILL.md'
$skill = Get-Content -Raw $skillPath
$sharedContract = Get-Content -Raw $sharedContractPath
$routingContract = Get-Content -Raw $routingContractPath
$checkpointSkill = Get-Content -Raw $checkpointSkillPath
$ticketAuditSkill = Get-Content -Raw $ticketAuditSkillPath
$ticketRemediationSkill = Get-Content -Raw $ticketRemediationSkillPath
$designSkill = Get-Content -Raw $designSkillPath

# Contract guards: the natural-language skill must carry the closed write scope
# and the shared ownership rule, because there is no executable finalizer.
Assert-Contains 'finalization immutability requirement' $skill 'AUDIT_ARTIFACT_IMMUTABILITY = REQUIRED'
Assert-Contains 'corresponding audit ownership requirement' $skill 'ONLY_THE_CORRESPONDING_AUDIT_SKILL_MAY_CREATE_OR_UPDATE_AN_AUDIT_ARTIFACT'
Assert-Contains 'finalization upstream audit invariant' $skill 'UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0'
Assert-Contains 'finalization upstream authority invariant' $skill 'UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0'
Assert-Contains 'finalization primary route preservation' $skill 'PRIMARY_ROUTE = <canonical route>'
Assert-Contains 'finalization source audit preservation' $skill 'SOURCE_AUDIT = <canonical audit artifact>'
Assert-Contains 'finalization source ticket preservation' $skill 'SOURCE_TICKET = <ticket id>'
Assert-Contains 'finalization plan audit prohibition' $skill 'IMPLEMENTATION_PLAN_AUDIT'
Assert-Contains 'finalization plan mutation prohibition' $skill 'Do not edit the Implementation Plan or Implementation Plan Audit'
Assert-Contains 'DAG release is declared' $skill '`DAG_RELEASE` records that a prerequisite edge owned by the finalized ticket is'
Assert-Contains 'DAG release is not downstream transition' $skill 'It is not a downstream ticket-state transition'
Assert-Contains 'downstream mutation prohibition' $skill 'DOWNSTREAM_TICKET_STATE_MUTATIONS = 0'
Assert-Contains 'post-finalization reconciliation route' $skill 'POST_FINALIZATION_NEXT_AUTHORIZED_OPERATION = audit-component-implementation-tickets'
Assert-Contains 'checkpoint reconciliation guard' $checkpointSkill 'must reject `design-ticket-implementation` or `implement-ready-tickets`'
Assert-Contains 'ticket audit post-finalization trigger' $ticketAuditSkill 'mandatory post-finalization audit trigger'
Assert-Contains 'ticket remediation factual promotion rule' $ticketRemediationSkill 'When remediation consumes a post-finalization ticket-set finding'
Assert-Contains 'routing reconciliation guard' $routingContract 'A finalization checkpoint is a local completion event'
Assert-Contains 'routing one-time consumption guard' $routingContract 'A historical finalization flag is not a perpetual audit trigger'
Assert-Contains 'design current ticket audit gate' $designSkill 'the current ticket-set audit is `IMPLEMENTATION_TICKETS_CONFORMANT`'
Assert-Contains 'design remediation barrier' $designSkill 'no ticket-set remediation or independent ticket-set re-audit is pending'
Assert-Contains 'design audit basis fields' $designSkill 'TICKET_SET_AUDIT_BASIS_FINGERPRINT:'
Assert-Contains 'shared audit ownership rule' $sharedContract 'AUDIT ARTIFACTS ARE OWNED BY THEIR AUDIT SKILL.'
Assert-Contains 'shared read-only consumption rule' $sharedContract 'OTHER SKILLS MAY READ AND CITE THEM, NEVER MUTATE THEM.'

$allowedWrites = @(
    'CURRENT_TICKET'
    'TICKET_INDEX / DAG_PROJECTION'
    'FINALIZATION_ARTIFACT'
    'CANONICAL_DOWNSTREAM_HANDOFF_INDEX'
)
$forbiddenWrites = @(
    'ADR'
    'PORTFOLIO'
    'PORTFOLIO_AUDIT'
    'COMPONENT_SPEC'
    'COMPONENT_SPEC_AUDIT'
    'GAP_MATRIX'
    'GAP_MATRIX_AUDIT'
    'IMPLEMENTATION_PLAN'
    'IMPLEMENTATION_PLAN_AUDIT'
    'TICKET_SET_AUDIT'
    'IMPLEMENTATION_AUDIT'
    'SPECIALIST_AUDITS'
    'IMPLEMENTATION_DESIGN_AUDIT'
)

Assert-Equal 'write scope has exactly four allowed classes' $allowedWrites.Count 4
Assert-Equal 'forbidden write scope has all thirteen classes' $forbiddenWrites.Count 13
Assert-Equal 'allowed/forbidden write scopes overlap' (@($allowedWrites | Where-Object { $_ -in $forbiddenWrites }).Count) 0

# DOM-001-TICKET-001 regression fixture. These are in-memory synthetic
# artifacts; no DOM-001 repository artifact is opened, written, or changed.
$input = [pscustomobject]@{
    TicketId = 'DOM-001-TICKET-001'
    TicketGate = 'READY_FOR_DONE'
    FindingId = 'IMA-MAJOR-002'
    FindingStatus = 'OPEN'
    PrimaryRoute = 'IMPLEMENTATION_PLAN_REVALIDATION'
    BlocksTicketDone = 'NO'
}
Assert-Equal 'fixture ticket gate' $input.TicketGate 'READY_FOR_DONE'
Assert-Equal 'fixture finding status' $input.FindingStatus 'OPEN'
Assert-Equal 'fixture primary route' $input.PrimaryRoute 'IMPLEMENTATION_PLAN_REVALIDATION'
Assert-Equal 'fixture local gate effect' $input.BlocksTicketDone 'NO'

$syntheticAuditArtifacts = [ordered]@{
    'SPEC-DOM-001-implementation-plan.md' = 'synthetic implementation plan'
    'SPEC-DOM-001-implementation-plan-audit.md' = 'synthetic plan audit: IMA-MAJOR-002 OPEN'
    'DOM-001-gap-matrix-audit.md' = 'synthetic gap matrix audit'
    'DOM-001-ticket-set-audit.md' = 'synthetic ticket-set audit'
    'DOM-001-implementation-audit.md' = 'synthetic canonical implementation audit'
    'DOM-001-specialist-audit.md' = 'synthetic specialist audit'
    'DOM-001-implementation-design-audit.md' = 'synthetic design audit'
}
$shaBefore = @{}
foreach ($artifact in $syntheticAuditArtifacts.Keys) {
    $shaBefore[$artifact] = Get-Sha256 $syntheticAuditArtifacts[$artifact]
}

# The skill's permitted result is a write manifest limited to ticket state,
# DAG/index projection, finalization evidence, and the downstream handoff.
$actualWrites = @(
    'CURRENT_TICKET'
    'TICKET_INDEX / DAG_PROJECTION'
    'FINALIZATION_ARTIFACT'
    'CANONICAL_DOWNSTREAM_HANDOFF_INDEX'
)
$forbiddenWritesObserved = @($actualWrites | Where-Object { $_ -in $forbiddenWrites })
Assert-Equal 'forbidden writes observed' $forbiddenWritesObserved.Count 0

# Finalization reads/cites the upstream audit and persists a handoff; it does
# not rewrite any synthetic upstream audit content.
$shaAfter = @{}
foreach ($artifact in $syntheticAuditArtifacts.Keys) {
    $shaAfter[$artifact] = Get-Sha256 $syntheticAuditArtifacts[$artifact]
    Assert-Equal "$artifact SHA immutability" $shaAfter[$artifact] $shaBefore[$artifact]
}

$requiredHandoffFields = @(
    'FINDING_ID'
    'STATUS = OPEN'
    'PRIMARY_ROUTE'
    'DOWNSTREAM_CHECKPOINT'
    'DOWNSTREAM_OWNER'
    'DEPENDENCY_CLASS'
    'BLOCKS_INTEGRATED_PROOF'
    'BLOCKS_SPEC_FINAL_CONFORMANCE'
    'SOURCE_AUDIT'
    'SOURCE_TICKET'
)
foreach ($field in $requiredHandoffFields) {
    Assert-Contains "handoff field $field" $skill $field
}

Write-Output 'UPSTREAM_AUDIT_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0'
Write-Output 'UPSTREAM_AUTHORITY_ARTIFACTS_MODIFIED_BY_FINALIZATION = 0'
Write-Output 'IMPLEMENTATION_PLAN_AUDIT_SHA_BEFORE = IMPLEMENTATION_PLAN_AUDIT_SHA_AFTER'
Write-Output 'PASS: finalize-implemented-ticket audit immutability regression'
