export const pdfTemplate = async (findLibrary: any) => {
    console.log('Generating PDF for library:', findLibrary?.checklisthistory[0]?.list);

    const htmlContent = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document Pages</title>
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        />
    </head>
    <body style="background-color: #f3f3f3">
        <div class="container my-4">
        <!-- SECTION 1 -->
        <section class="mb-5">
            <div class="card shadow-sm">
            <div
                class="card-header d-flex justify-content-between align-items-center"
                style="background-color: #e4e4e4; height: 80px"
            >
                <h6
                style="
                    color: #04aeef;
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                "
                >
                Document Information
                </h6>
                <img src="/download 1.png" alt="Logo" style="height: 20px" />
            </div>

            <div class="p-3 border-bottom">
                <div class="d-flex justify-content-between">
                <h6 style="font-weight: 600">Overview & Definition</h6>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                <div style="color: #04aeef; font-size: 14px; font-weight: 600">
                    Document Information
                </div>
                <br />

            </div>

            <div class="p-3 border-bottom">
                <div class="row mb-2">
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >ID</strong
                    ><br />9090
                </div>
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >CAPA Name</strong
                    ><br />${findLibrary?.name}
                </div>
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >${findLibrary?.priority}</strong
                    ><br />High
                </div>
                </div>
                <div class="row mb-2">
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >Created Date</strong
                    ><br />${findLibrary?.createdAt ? new Date(findLibrary?.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >Status</strong
                    ><br />${findLibrary?.status}
                </div>
                </div>
                <div class="row mb-2">
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >Start Date</strong
                    ><br />${findLibrary?.startDate ? new Date(findLibrary?.startDate).toLocaleDateString() : 'N/A'}
                </div>
                <div class="col-4">
                    <strong
                    style="color: #0049b7; font-size: 14px; font-weight: 500"
                    >End Date</strong
                    ><br />${findLibrary?.dueDate ? new Date(findLibrary?.dueDate).toLocaleDateString() : 'N/A'}
                </div>
                </div>
            </div>

            <div class="p-3 border-bottom">
                <h6 style="color: #04aeef; font-size: 14px; font-weight: 600">
                Description
                </h6>
                <p style="font-size: 14px; font-weight: 500; color: #2e263de5">
                ${findLibrary?.description}
                </p>
            </div>

            <div class="p-3">
                <div class="d-flex justify-content-between mb-2">
                <h6 style="color: #04aeef; font-size: 14px; font-weight: 600">
                    Managers list
                </h6>
                <span style="color: #04aeef; font-size: 14px; font-weight: 600"
                    >${findLibrary?.managers?.length || 0}</span
                >
                </div>
                <table class="table table-bordered table-sm">
                <thead>
                    <tr>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Name
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Role
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Email
                    </th>
                    </tr>
                </thead>
                <tbody>
                   ${findLibrary?.managers?.map((member: any) => `
                   <tr>
                    <td>
                        <img
                        src="${member?.profilePicture}"
                        class="rounded-circle"
                        style="height: 30px"
                        />
                        ${member.name || 'N/A'}
                    </td>
                    <td>${member?.role || 'N/A'}</td>
                    <td>${member.email || 'N/A'}</td>
                    </tr>`).join('')}
                </tbody>
                </table>
            </div>
            <div class="p-3">
                <div class="d-flex justify-content-between mb-2">
                <h6 style="color: #04aeef; font-size: 14px; font-weight: 600">
                    Total Members list
                </h6>
                <span style="color: #04aeef; font-size: 14px; font-weight: 600"
                    >${findLibrary?.members?.length || 0}</span
                >
                </div>
                <table class="table table-bordered table-sm">
                <thead>
                    <tr>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Name
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Role
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Email
                    </th>
                    </tr>
                </thead>
                <tbody>
                   ${findLibrary?.members?.map((member: any) => `
                   <tr>
                    <td>
                        <img
                        src="${member?.profilePicture}"
                        class="rounded-circle"
                        style="height: 30px"
                        />
                        ${member.name || 'N/A'}
                    </td>
                    <td>${member?.role || 'N/A'}</td>
                    <td>${member.email || 'N/A'}</td>
                    </tr>`).join('')}
                </tbody>
                </table>
            </div>
            </div>
        </section>

        <!-- SECTION 2 -->
        <section class="mb-5">
            <div class="card shadow-sm">
            <div class="p-3">
                <div class="d-flex justify-content-between mb-2">
                <h6 style="color: #04aeef; font-size: 14px; font-weight: 600">
                    CAPA Cause
                </h6>
                <span style="color: #04aeef; font-size: 14px; font-weight: 600"
                    >${findLibrary?.causes?.length || 0}</span
                >
                </div>
                <table class="table table-bordered table-sm">
                <thead>
                    <tr>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        No
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Name
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Create Date
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Causes Description
                    </th>
                    </tr>
                </thead>
                <tbody>
                   ${findLibrary?.causes?.map((cause: any, index: number) => `
                   <tr>
                    <td>${index + 1}</td>
                    <td>${cause.name || 'N/A'}</td>
                    <td>${new Date(cause.createdAt).toLocaleDateString() || 'N/A'}</td>
                    <td>${cause.description || 'N/A'}</td>
                    </tr>`).join('')}
                </tbody>
                </table>
            </div>
            <div class="p-3 border-bottom">
                <div class="d-flex justify-content-between mb-2">
                <h6 style="color: #04aeef; font-size: 14px; font-weight: 600">
                    Action Status
                </h6>
                </div>

                <div class="row mb-2">
                <div class="col-3">
                    <strong
                    style="color: #34a853; font-size: 14px; font-weight: 500"
                    >Action Complete</strong
                    ><br />${findLibrary?.completedActions || 0}
                </div>
                <div class="col-3">
                    <strong
                    style="color: #04aeef; font-size: 14px; font-weight: 500"
                    >Action Incomplete</strong
                    ><br />${findLibrary?.inProgressActions || 0}
                </div>
                <div class="col-3">
                    <strong
                    style="color: #ffd200; font-size: 14px; font-weight: 500"
                    >Action Pending</strong
                    ><br />${findLibrary?.pendingActions || 0}
                </div>
                <div class="col-3">
                    <strong
                    style="color: #f68d2b; font-size: 14px; font-weight: 500"
                    >Action On Hold</strong
                    ><br />${findLibrary?.onHoldActions || 0}
                </div>
                </div>
            </div>
            </div>
        </section>

        <!-- SECTION 3 -->
        <section class="mb-5">
            <div class="card shadow-sm">
            <div class="p-3 border-bottom">
                <div class="d-flex justify-content-between">
                <h6 style="font-weight: 600">Progress</h6>
                </div>

            </div>

            <div class="border-bottom p-3">
                <h6 style="font-size: 14; font-weight: 600; color: #04aeef">
                Progress Tracking <span class="float-end">$${findLibrary?.completedActions / (findLibrary?.completedActions + findLibrary?.inProgressActions + findLibrary?.pendingActions + findLibrary?.onHoldActions) * 100 || 0}%</span>
                </h6>
            </div>
            <div class="p-3">

                ${findLibrary?.actions?.map((action: any) => `
                <div
                class="p-3 mb-2 border rounded"
                style="background-color: #f1f1f1; border-color: #0049b714"
                >
                <div class="row">
                    <div class="col-3">
                    <strong style="font-weight: 500">Action</strong><br />
                    <span style="color: #2e263de5">${action.name || 'N/A'}</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Create Date</strong><br />
                    <span style="color: #2e263de5">${new Date(action.createdAt).toLocaleDateString() || 'N/A'}</span>
                    </div>
                    <div class="col-6">
                    <strong style="font-weight: 500">Assigned to</strong><br />
                   ${action.assignedTo ? action.assignedTo?.map((user: any) => user.name).join(", ") : "N/A"}
                    </div>
                </div>
                <div class="row mt-2">
                    <div class="col-3">
                    <strong style="font-weight: 500">Status</strong><br />
                    <span
                        class="badge p-2"
                        style="background-color: #f8cecc; color: #2e263de5"
                   >${action.status || 'N/A'}</span
                    >
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Priority</strong><br />
                    <span
                        class="badge p-2"
                        style="background-color: #f8cecc; color: #2e263de5"
                        >${action.priority || 'N/A'}</span
                    >
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Start Date / End Date</strong
                    ><br />
                    <span style="color: #2e263de5">${new Date(action.startDate).toLocaleDateString() || 'N/A'} - ${new Date(action.endDate).toLocaleDateString() || 'N/A'}</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Evidence</strong><br />
                    <span style="color: #2e263de5">${action?.docfile ? "Attached" : "N/A"}</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Linked Root Cause</strong><br />
                    <span style="color: #2e263de5">${action?.cause ? "Attached" : "N/A"}</span>
                    </div>
                </div>
                </div>
    
            </div>`)}


            </div>
        </section>

        <!-- SECTION 4 -->
        <section class="mb-5">
            <div class="card shadow-sm">
            

            <div class="p-3 border-bottom">
                <div class="d-flex justify-content-between">
                <h6 style="font-weight: 600">Effectiveness</h6>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                <div style="color: #04aeef; font-size: 14px; font-weight: 600">
                    Effectiveness Up to dated
                </div>
                <br />
                </div>
            </div>

            <div class="p-3 border-bottom">
                <div
                class="p-3 mb-2 border rounded"
                style="background-color: #f1f1f1; border-color: #0049b714"
                >
                <p>
                    <strong style="font-size: 14px; font-weight: 500"
                    >Checklist items</strong
                    ><br />
                    <span style="color: #2e263de5; font-size: 14px"
                    >all action completed as planned?</span
                    >
                </p>
                <div class="row">
                    <div class="col-3">
                    <strong style="font-weight: 500">Yes</strong><br />
                    <span style="color: #2e263de5">Not a Checked</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">No</strong><br />
                    <span style="color: #2e263de5">Not a Checked</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Evidence</strong><br />
                    <span style="color: #2e263de5">File Attached</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Partial</strong><br />
                    <span style="color: #2e263de5">Yes, Checked</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Comments</strong><br />
                    <span style="color: #2e263de5">See comment details here</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Follow-Up Status</strong
                    ><br />
                    <span style="color: #2e263de5">No</span>
                    </div>
                </div>
                </div>
                <div
                class="p-3 mb-2 border rounded"
                style="background-color: #f1f1f1; border-color: #0049b714"
                >
                <p>
                    <strong style="font-size: 14px; font-weight: 500"
                    >Checklist items</strong
                    ><br />
                    <span style="color: #2e263de5; font-size: 14px"
                    >all action completed as planned?</span
                    >
                </p>
                <div class="row">
                    <div class="col-3">
                    <strong style="font-weight: 500">Yes</strong><br />
                    <span style="color: #2e263de5">Not a Checked</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">No</strong><br />
                    <span style="color: #2e263de5">Not a Checked</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Evidence</strong><br />
                    <span style="color: #2e263de5">File Attached</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Partial</strong><br />
                    <span style="color: #2e263de5">Yes, Checked</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Comments</strong><br />
                    <span style="color: #2e263de5">See comment details here</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Follow-Up Status</strong
                    ><br />
                    <span style="color: #2e263de5">No</span>
                    </div>
                </div>
                </div>
            </div>

            <div class="p-3 border-bottom">
                <div
                style="
                    color: #04aeef;
                    font-size: 14px;
                    font-weight: 600;
                    padding-bottom: 8px;
                "
                >
                Validate Effectiveness
                </div>
                <div class="mt-2 border-bottom border-top py-3">
                <strong style="font-size: 14px; font-weight: 500; color: #0049b7"
                    >Effectiveness Score</strong
                >
                <p
                    style="
                    color: orange;
                    font-size: 14px;
                    font-weight: 500;
                    margin: 0px;
                    "
                >
                    60%
                </p>
                </div>

                <p class="mb-1">
                <strong style="font-size: 14px; font-weight: 500; color: #0049b7"
                    >Validation Summary</strong
                >
                </p>
                <ul style="font-size: 14px; font-weight: 500">
                <li>Full Implemented: 1</li>
                <li>Partially Implemented: 1</li>
                <li>Not Implemented: 1</li>
                </ul>
            </div>
            </div>
        </section>

        <!-- SECTION 5 -->
        <section class="mb-5">
            <div class="card shadow-sm">
            <div
                class="card-header d-flex justify-content-between align-items-center"
                style="background-color: #e4e4e4; height: 80px"
            >
                <h6
                style="
                    color: #04aeef;
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                "
                >
                Document Information
                </h6>
                <img src="/download 1.png" alt="Logo" style="height: 20px" />
            </div>

            <div class="p-3 border-bottom">
                <div class="d-flex justify-content-between">
                <h6 style="font-weight: 600">File & Export</h6>
                <h2 style="color: #0049b7; font-weight: 600; font-size: 14px">
                    Manager
                </h2>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                <div style="color: #04aeef; font-size: 14px; font-weight: 600">
                    File & Export Data
                </div>
                <br />
                <div class="d-flex justify-content-center gap-3">
                    <p style="color: #2e263de5; font-weight: 500">Alina John</p>
                    <img
                    src="/profile.png"
                    class="rounded-circle"
                    style="height: 30px"
                    />
                </div>
                </div>
            </div>

            <div class="p-3">
                <table class="table table-bordered table-sm">
                <thead>
                    <tr>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Name
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Uploaded By
                    </th>
                    <th
                        style="
                        background-color: #043b6a;
                        color: white;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        class="py-2"
                    >
                        Date Uploaded
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>Employee contracts...</td>
                    <td>
                        <img
                        src="/profile.png"
                        class="rounded-circle"
                        style="height: 30px"
                        />
                        Alina John
                    </td>
                    <td>10/02/2025</td>
                    </tr>
                    <tr>
                    <td>Employee contracts...</td>
                    <td>
                        <img
                        src="/profile.png"
                        class="rounded-circle"
                        style="height: 30px"
                        />
                        Alina John
                    </td>
                    <td>10/02/2025</td>
                    </tr>
                    <tr>
                    <td>Employee contracts...</td>
                    <td>
                        <img
                        src="/profile.png"
                        class="rounded-circle"
                        style="height: 30px"
                        />
                        Alina John
                    </td>
                    <td>10/02/2025</td>
                    </tr>
                    <tr>
                    <td>Employee contracts...</td>
                    <td>
                        <img
                        src="/profile.png"
                        class="rounded-circle"
                        style="height: 30px"
                        />
                        Alina John
                    </td>
                    <td>10/02/2025</td>
                    </tr>
                </tbody>
                </table>
            </div>
            </div>
        </section>

        <!-- SECTION 6 -->
        <section class="mb-5">
            <div class="card shadow-sm">
            <div
                class="card-header d-flex justify-content-between align-items-center"
                style="background-color: #e4e4e4; height: 80px"
            >
                <h6
                style="
                    color: #04aeef;
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                "
                >
                Document Information
                </h6>
                <img src="/download 1.png" alt="Logo" style="height: 20px" />
            </div>

            <div class="p-3 border-bottom">
                <div class="d-flex justify-content-between">
                <h6 style="font-weight: 600">Activity Log</h6>
                <h2 style="color: #0049b7; font-weight: 600; font-size: 14px">
                    Manager
                </h2>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                <div style="color: #04aeef; font-size: 14px; font-weight: 600">
                    Activity Log Details
                </div>
                <br />
                <div class="d-flex justify-content-center gap-3">
                    <p style="color: #2e263de5; font-weight: 500">Alina John</p>
                    <img
                    src="/profile.png"
                    class="rounded-circle"
                    style="height: 30px"
                    />
                </div>
                </div>
            </div>

            <div class="p-3 border-bottom">
                <div
                class="p-3 mb-2 border rounded"
                style="background-color: #f1f1f1; border-color: #0049b714"
                >
                <div class="row">
                    <div class="col-3">
                    <strong style="font-weight: 500">Timestamp</strong><br />
                    <span style="color: #2e263de5">9090</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Date</strong><br />
                    <span style="color: #2e263de5">09/23/2025</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">User</strong><br />
                    <img
                        src="/profile.png"
                        class="rounded-circle"
                        style="height: 30px"
                    />
                    Alina John
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Action</strong><br />
                    <span
                        class="badge"
                        style="
                        background-color: #2c7d3033;
                        border: 1px solid #2c7d3066;
                        padding: 10px;
                        color: #2e263de5;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        >Approved</span
                    >
                    </div>
                </div>
                <div class="mt-2">
                    <strong style="font-weight: 500">Comments/Details</strong><br />
                    <span style="color: #2e263de5"
                    >Effectiveness score too low. Training logs incomplete.</span
                    >
                </div>
                </div>
                <div
                class="p-3 mb-2 border rounded"
                style="background-color: #f1f1f1; border-color: #0049b714"
                >
                <div class="row">
                    <div class="col-3">
                    <strong style="font-weight: 500">Timestamp</strong><br />
                    <span style="color: #2e263de5">9090</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Date</strong><br />
                    <span style="color: #2e263de5">09/23/2025</span>
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">User</strong><br />
                    <img
                        src="/profile.png"
                        class="rounded-circle"
                        style="height: 30px"
                    />
                    Alina John
                    </div>
                    <div class="col-3">
                    <strong style="font-weight: 500">Rejected</strong><br />
                    <span
                        class="badge"
                        style="
                        background-color: #f8cecc;
                        border: 1px solid #ff000066;
                        padding: 10px;
                        color: #2e263de5;
                        font-size: 14px;
                        font-weight: 500;
                        "
                        >Approved</span
                    >
                    </div>
                </div>
                <div class="mt-2">
                    <strong style="font-weight: 500">Comments/Details</strong><br />
                    <span style="color: #2e263de5"
                    >Effectiveness score too low. Training logs incomplete.</span
                    >
                </div>
                </div>
            </div>
            </div>
        </section>
        </div>
    </body>
    </html>

  `;
    return htmlContent;
};
