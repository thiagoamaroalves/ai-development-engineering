$ErrorActionPreference = 'Stop'

function Assert-Equal([string]$name, $actual, $expected) {
    if ($actual -ne $expected) {
        throw "$name expected '$expected' but was '$actual'"
    }
}

function Derive-Finding($finding) {
    foreach ($property in @('BlocksLocalExecution', 'BlocksLocalClosure', 'BlocksTicketDone', 'BlocksIntegratedProof')) {
        $finding | Add-Member -NotePropertyName $property -NotePropertyValue $null -Force
    }

    $localCapability = $finding.DependencyClass -in @(
        'REQUIRED_FOR_LOCAL_EXECUTION',
        'REQUIRED_FOR_LOCAL_CLOSURE'
    )

    $integratedOnlyAvailability = (
        $finding.Category -eq 'CAPABILITY_AVAILABILITY_CONTRADICTION' -and
        $finding.DependencyClass -eq 'REQUIRED_FOR_INTEGRATED_PROOF' -and
        $finding.LocalClosureBlocking -eq 'NO' -and
        $finding.LocalAcceptanceRequiresProductiveCapability -eq 'NO' -and
        $finding.DependencyClassReclassificationRequired -ne 'YES'
    )

    $reclassifiedLocal = (
        $finding.DependencyClassReclassificationRequired -eq 'YES' -and
        $finding.LocalAcceptanceRequiresProductiveCapability -eq 'YES' -and
        $finding.ReclassificationEvidence -and
        $finding.Route -eq 'PLAN_OR_TICKET_REVALIDATION'
    )

    $finding.BlocksLocalExecution = if ($integratedOnlyAvailability) { 'NO' } elseif ($reclassifiedLocal) { 'YES' } elseif ($localCapability -and $finding.ProductiveAvailability -eq 'NO') { 'YES' } else { $finding.LocalExecutionDefect }
    $finding.BlocksLocalClosure = if ($integratedOnlyAvailability) { 'NO' } elseif ($reclassifiedLocal) { 'YES' } elseif ($localCapability -and $finding.ProductiveAvailability -eq 'NO') { 'YES' } else { $finding.LocalClosureDefect }
    $finding.BlocksTicketDone = if ($finding.BlocksLocalExecution -eq 'YES' -or $finding.BlocksLocalClosure -eq 'YES') { 'YES' } else { 'NO' }
    $finding.BlocksIntegratedProof = if ($integratedOnlyAvailability) { 'YES' } else { $finding.IntegratedProofDefect }
    $finding
}

$integrated = Derive-Finding ([pscustomobject]@{
    Id = 'IMA-MAJOR-002'
    Status = 'OPEN'
    Category = 'CAPABILITY_AVAILABILITY_CONTRADICTION'
    Capability = 'CAP-PLAT-SNAPSHOT-PIPELINE-PROVENANCE'
    ProductiveAvailability = 'NO'
    DependencyClass = 'REQUIRED_FOR_INTEGRATED_PROOF'
    LocalClosureBlocking = 'NO'
    LocalAcceptanceRequiresProductiveCapability = 'NO'
    DependencyClassReclassificationRequired = 'NO'
    UpstreamDependencyClassificationPreserved = 'YES'
    ReclassificationEvidence = $null
    LocalExecutionDefect = 'NO'
    LocalClosureDefect = 'NO'
    IntegratedProofDefect = 'YES'
    Route = 'IMPLEMENTATION_PLAN_REVALIDATION'
})
Assert-Equal 'IMA-MAJOR-002 status' $integrated.Status 'OPEN'
Assert-Equal 'IMA-MAJOR-002 local execution' $integrated.BlocksLocalExecution 'NO'
Assert-Equal 'IMA-MAJOR-002 local closure' $integrated.BlocksLocalClosure 'NO'
Assert-Equal 'IMA-MAJOR-002 ticket done' $integrated.BlocksTicketDone 'NO'
Assert-Equal 'IMA-MAJOR-002 integrated proof' $integrated.BlocksIntegratedProof 'YES'
Assert-Equal 'IMA-MAJOR-002 route' $integrated.Route 'IMPLEMENTATION_PLAN_REVALIDATION'
Assert-Equal 'IMA-MAJOR-002 reclassification' $integrated.DependencyClassReclassificationRequired 'NO'
Assert-Equal 'IMA-MAJOR-002 upstream classification' $integrated.UpstreamDependencyClassificationPreserved 'YES'

$localFindings = foreach ($id in @('IMA-CRITICAL-001', 'IMA-MAJOR-004')) {
    Derive-Finding ([pscustomobject]@{
        Id = $id
        Status = 'OPEN'
        Category = 'LOCAL_ACCEPTANCE_DEFECT'
        Capability = 'LOCAL'
        ProductiveAvailability = 'N/A'
        DependencyClass = 'REQUIRED_FOR_LOCAL_CLOSURE'
        LocalClosureBlocking = 'YES'
        LocalAcceptanceRequiresProductiveCapability = 'YES'
        DependencyClassReclassificationRequired = 'NO'
        UpstreamDependencyClassificationPreserved = 'YES'
        LocalExecutionDefect = 'NO'
        LocalClosureDefect = 'YES'
        IntegratedProofDefect = 'NO'
        Route = 'IMPLEMENTATION_REMEDIATION'
    })
}

$ticketLocalDoneBlockers = @($integrated) + @(
    $localFindings
)
$ticketLocalDoneBlockers = @($ticketLocalDoneBlockers | Where-Object { $_.BlocksTicketDone -eq 'YES' })
Assert-Equal 'integrated-only availability invariant' ($ticketLocalDoneBlockers.Id -contains 'IMA-MAJOR-002') $false
Assert-Equal 'positive local blocker IMA-CRITICAL-001' ($ticketLocalDoneBlockers.Id -contains 'IMA-CRITICAL-001') $true
Assert-Equal 'positive local blocker IMA-MAJOR-004' ($ticketLocalDoneBlockers.Id -contains 'IMA-MAJOR-004') $true
Assert-Equal 'local blocker count' $ticketLocalDoneBlockers.Count 2
Write-Output ("TICKET_LOCAL_DONE_BLOCKERS = " + (($ticketLocalDoneBlockers.Id | Sort-Object) -join ', '))
Write-Output 'PASS: finding completion/readiness regression simulation'
