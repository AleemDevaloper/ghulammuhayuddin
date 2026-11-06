# SignalDesk - Frontend QA Matrix

| Check | Method | Status |
|---|---|---|
| Overview renders | Automated Chromium browser test | Pass |
| All six main showcase views render | Navigate sidebar and assert page heading | Pass |
| No JavaScript page errors | Browser pageerror event | Pass |
| Search works | Filter contact by name | Pass |
| Add lead works | Submit modal and verify row | Pass |
| Pipeline stage change | Select stage, verify toast/update | Pass |
| Approval works | Approve selected pending item | Pass |
| Workflow test-run | Simulate run and verify run entry | Pass |
| PDF searchable | Verify text extraction in exported PDF | Tested in packaging |
| Architecture SVG parseable | XML parse and PNG conversion | Pass |

Browser interactions use local data only; backend API testing is outside this project's scope.
