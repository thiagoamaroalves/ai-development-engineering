$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Resolve-BaselineRemediationGate {
    param(
        [Parameter(Mandatory)] [string] $DriftStatus,
        [Parameter(Mandatory)] [string] $ReassessmentComplete,
        [Parameter(Mandatory)] [string] $FindingsActionable,
        [Parameter(Mandatory)] [string] $AuditBasisFingerprint,
        [Parameter(Mandatory)] [string] $LiveFingerprint
    )

    if ($LiveFingerprint -ne $AuditBasisFingerprint) {
        return [pscustomobject]@{
            Readiness = 'BLOCKED_INSUFFICIENT_REASSESSMENT'
            Entry = 'BLOCKED'
            Reason = 'STALE_AUDIT_BASIS'
        }
    }

    if ($DriftStatus -eq 'DRIFT_UNASSESSED' -or $ReassessmentComplete -ne 'YES') {
        return [pscustomobject]@{
            Readiness = 'BLOCKED_INSUFFICIENT_REASSESSMENT'
            Entry = 'BLOCKED'
            Reason = 'BLOCKED_INSUFFICIENT_REASSESSMENT'
        }
    }

    if ($DriftStatus -eq 'NO_DRIFT' -or
        ($DriftStatus -eq 'DRIFT_ASSESSED' -and $FindingsActionable -eq 'YES')) {
        return [pscustomobject]@{
            Readiness = 'READY'
            Entry = 'READY_FOR_BASELINE_RECONCILIATION_REMEDIATION'
            Reason = $null
        }
    }

    throw "Unsupported baseline state: $DriftStatus"
}

function Assert-Equal {
    param(
        [Parameter(Mandatory)] [string] $Name,
        [AllowNull()] [string] $Actual,
        [AllowNull()] [string] $Expected
    )

    if ($Actual -ne $Expected) {
        throw "$Name failed. Expected '$Expected', got '$Actual'."
    }
}

# REG-DOM-001-ASSESSED: synthetic fixture; no DOM-001 artifact is opened.
$domFacts = [pscustomobject]@{
    PreservedGaps = 21
    ObsoleteGap = 'GAP-002'
    MissingCapabilityAvailabilityRecords = 3
    CorrectionScopeComplete = $true
}
Assert-Equal 'DOM-001 preserved gaps' $domFacts.PreservedGaps '21'
Assert-Equal 'DOM-001 obsolete gap' $domFacts.ObsoleteGap 'GAP-002'
Assert-Equal 'DOM-001 capability records' $domFacts.MissingCapabilityAvailabilityRecords '3'
Assert-Equal 'DOM-001 correction scope' ([string]$domFacts.CorrectionScopeComplete) 'True'

$dom = Resolve-BaselineRemediationGate `
    -DriftStatus 'DRIFT_ASSESSED' `
    -ReassessmentComplete 'YES' `
    -FindingsActionable 'YES' `
    -AuditBasisFingerprint 'SPEC:r4|repo:current|evidence:current' `
    -LiveFingerprint 'SPEC:r4|repo:current|evidence:current'
Assert-Equal 'DOM-001 readiness' $dom.Readiness 'READY'
Assert-Equal 'DOM-001 entry' $dom.Entry 'READY_FOR_BASELINE_RECONCILIATION_REMEDIATION'
Assert-Equal 'DOM-001 reason' $dom.Reason $null

# REG-STALE-AFTER-AUDIT: complete reassessment is bound to its exact fingerprint.
$stale = Resolve-BaselineRemediationGate `
    -DriftStatus 'DRIFT_ASSESSED' `
    -ReassessmentComplete 'YES' `
    -FindingsActionable 'YES' `
    -AuditBasisFingerprint 'SPEC:r4|repo:current|evidence:current' `
    -LiveFingerprint 'SPEC:r4|repo:after-audit|evidence:new'
Assert-Equal 'stale readiness' $stale.Readiness 'BLOCKED_INSUFFICIENT_REASSESSMENT'
Assert-Equal 'stale entry' $stale.Entry 'BLOCKED'
Assert-Equal 'stale reason' $stale.Reason 'STALE_AUDIT_BASIS'

# REG-INCOMPLETE-REASSESSMENT: drift without a complete proof remains blocked.
$incomplete = Resolve-BaselineRemediationGate `
    -DriftStatus 'DRIFT_UNASSESSED' `
    -ReassessmentComplete 'NO' `
    -FindingsActionable 'YES' `
    -AuditBasisFingerprint 'SPEC:unknown|repo:unknown|evidence:unknown' `
    -LiveFingerprint 'SPEC:unknown|repo:unknown|evidence:unknown'
Assert-Equal 'incomplete readiness' $incomplete.Readiness 'BLOCKED_INSUFFICIENT_REASSESSMENT'
Assert-Equal 'incomplete entry' $incomplete.Entry 'BLOCKED'
Assert-Equal 'incomplete reason' $incomplete.Reason 'BLOCKED_INSUFFICIENT_REASSESSMENT'

Write-Output 'BASELINE_DRIFT_REMEDIATION_REGRESSION: PASS'
