export async function GET() {
  // This is the sample data from NOW-SCRIPT-OUTPUT-SIMPLE.txt
  const sampleData = {
    "x_nowge_rfx_ai": {
      "use_cases": [
        {
          "sys_id": "062154d947242210d93447c4416d437f",
          "name": "RFX Request Intake Manager",
          "description": "This use case manages the intake process for new RFX (RFP, RFI, RFQ) requests from business users, ensuring all required information is collected, validated, and properly recorded in the system before document generation.",
          "triggers": [
            {
              "sys_id": "a68530d147282210d93447c4416d43b5",
              "name": null,
              "objective_template": "Validate all required information for RFX request ${number}, ensuring it meets organizational standards before routing for approval.",
              "condition": "opened_byISNOTEMPTY^runrfx=true^EQ",
              "target_table": "x_nowge_rfx_ai_rfx_request"
            }
          ],
          "agents": [
            {
              "sys_id": "c12f605947e42210d93447c4416d43b8",
              "name": "RFX Approval Coordinator",
              "description": "Specialized agent that manages the approval workflow for validated RFX requests",
              "role": "You are an approval process coordinator responsible for routing validated RFX requests for approval, tracking approval status, and ensuring the request receives all necessary authorizations.",
              "instructions": "1. Retrieve request details via Get RFx Request\n2. Approve and update the RFX request via the Create Approval Workflow tool.",
              "tools": [
                {
                  "sys_id": "bb94345147282210d93447c4416d43f0",
                  "name": "Create Approval Workflow",
                  "description": "Runs an approval workflow for RFX requests. Use this tool when an RFX request has been validated and is ready for the approval process. The tool automatically routes the request to appropriate stakeholders for approval/rejection and updates the record's approval status.",
                  "type": "subflow"
                },
                {
                  "sys_id": "2f94345147282210d93447c4416d43e9",
                  "name": "Get RFx Request",
                  "description": "Get RFx Request",
                  "type": "subflow"
                }
              ]
            },
            {
              "sys_id": "0ccce05547e42210d93447c4416d4367",
              "name": "RFX Validator",
              "description": "Specialized agent that validates RFX request information against organizational policies and standards",
              "role": "You are a compliance specialist responsible for validating new RFX requests against organizational policies, standards, and best practices to ensure they meet all requirements before proceeding to approval.",
              "instructions": "1. Review the RFX request details for completeness and compliance\n2. (simulate its verified) Verify that:\n   - All mandatory fields are completed\n   - Timeline is reasonable (sufficient time for vendors to respond)\n   - Budget information aligns with organizational guidelines\n   - Requirements are clearly articulated\n   - Evaluation criteria are specific and measurable\n\n3. (simulate no issues found) If any issues are found:\n   - Clearly identify what needs to be corrected\n   - Update the RFX request status to \"Needs Revision\"\n   - Provide specific guidance on required changes\n\n4.  (simulate all standards met) If the request meets all standards:\n   - Update the RFX request status to \"Validated\"\n   - Route the request for approvals\n   - Record validation completion\n\n5. Document your validation assessment in the request record",
              "tools": [
                {
                  "sys_id": "24be241947e42210d93447c4416d43e7",
                  "name": "Get RFX Request",
                  "description": "Retrieves RFX Request record details, including: number, type, short description, status, budget range, requirements",
                  "type": "subflow"
                },
                {
                  "sys_id": "e0be241947e42210d93447c4416d43ee",
                  "name": "Validate RFX Request",
                  "description": "Validates an RFX request against organizational policies and standards, checking for completeness, compliance, and adherence to best practices. Use this tool after all information has been collected to ensure the request meets requirements before routing for approval.",
                  "type": "subflow"
                },
                {
                  "sys_id": "e4bea41947e42210d93447c4416d438e",
                  "name": "Update RFX Status",
                  "description": "Updates an existing RFX request with modified or additional information. Use this tool when changes need to be made to an existing request, such as adding missing information or making corrections based on validation feedback.",
                  "type": "subflow"
                }
              ]
            }
          ]
        }
      ]
    }
  };

  return Response.json(sampleData);
} 