"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfTemplateforMutiples = exports.pdfTemplate = void 0;
const pdfTemplate = async (findLibrary) => {
    console.log('Generating PDF for library:', findLibrary?.checklisthistory);
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
                            <img src="https://res.cloudinary.com/dsqe9zgox/image/upload/v1755506975/logo_srvvol.png" alt="Logo" style="height: 20px" />
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
                                    >Name</strong
                                    ><br />${findLibrary?.name}
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
                                 ${findLibrary?.managers
        ?.map((member) => `
                                 <tr>
                                    <td>
                                            <img
                                            src="${member?.profilePicture}"
                                            class="rounded-circle"
                                            style="height: 30px; width: 30px"
                                            />
                                            ${member.name || 'N/A'}
                                    </td>
                                    <td>${member?.role || 'N/A'}</td>
                                    <td>${member.email || 'N/A'}</td>
                                    </tr>`)
        .join('')}
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
                                 ${findLibrary?.members
        ?.map((member) => `
                                 <tr>
                                    <td>
                                            <img
                                            src="${member?.profilePicture}"
                                            class="rounded-circle"
                                            style="height: 30px; width: 30px"
                                            />
                                            ${member.name || 'N/A'}
                                    </td>
                                    <td>${member?.role || 'N/A'}</td>
                                    <td>${member.email || 'N/A'}</td>
                                    </tr>`)
        .join('')}
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
                                    Cause
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
                                 ${findLibrary?.causes
        ?.map((cause, index) => `
                                 <tr>
                                    <td>${index + 1}</td>
                                    <td>${cause.name || 'N/A'}</td>
                                    <td>${new Date(cause.createdAt).toLocaleDateString() || 'N/A'}</td>
                                    <td>${cause.description || 'N/A'}</td>
                                    </tr>`)
        .join('')}
                            </tbody>
                            </table>
                    </div>
                    </div>
            </section>
            <!-- SECTION  for Controls -->
            <section class="mb-5">
                <div class="card shadow-sm">
                    <div class="p-3">
                            <div class="d-flex justify-content-between mb-2">
                            <h6 style="color: #04aeef; font-size: 14px; font-weight: 600">
                                    Controls
                            </h6>
                            <span style="color: #04aeef; font-size: 14px; font-weight: 600"
                                    >${findLibrary?.controls?.length || 0}</span
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
                                        Description
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
                                        Control Type
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
                                       Effectiveness
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
                                        Owners
                                    </th>
                                    </tr>
                            </thead>
                            <tbody>
                                 ${findLibrary?.controls
        ?.map((control, index) => `
                                 <tr>
                                    <td>${index + 1}</td>
                                    <td>${control.name || 'N/A'}</td>
                                    <td>${new Date(control.createdAt).toLocaleDateString() || 'N/A'}</td>
                                    <td>${control.description || 'N/A'}</td>
                                    <td>${control.controlType || 'N/A'}</td>
                                    <td>${control.effectiveness || 'N/A'}</td>
                                    <td>${control.owners?.map((owner) => owner.name).join(', ') || 'N/A'}</td>
                                    </tr>`)
        .join('')}
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
                                    >Action Open</strong
                                    ><br />${findLibrary?.openActions || 0}
                            </div>
                            <div class="col-3">
                                    <strong
                                    style="color: #04aeef; font-size: 14px; font-weight: 500"
                                    >Action In Progress</strong
                                    ><br />${findLibrary?.inProgressActions || 0}
                            </div>
                            <div class="col-3">
                                    <strong
                                    style="color: #ffd200; font-size: 14px; font-weight: 500"
                                    >Action Closed</strong
                                    ><br />${findLibrary?.closedActions || 0}
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
                            Progress Tracking <span class="float-end">$${((findLibrary?.closedActions || 0) /
        ((findLibrary?.openActions || 0) +
            (findLibrary?.inProgressActions || 0) +
            (findLibrary?.closedActions || 0))) *
        100 || 0}%</span>
                            </h6>
                    </div>
                    <div class="p-3">

                            ${findLibrary?.actions
        ?.map((action) => `
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
                                 ${action.assignedTo ? action.assignedTo?.map((user) => user.name).join(', ') : 'N/A'}
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
                                    <strong style="font-weight: 500">Personnel</strong><br />
                                    <span
                                            class="badge p-2"
                                            style="background-color: #f8cecc; color: #2e263de5"
                                            >${action.personnel || 'N/A'}</span
                                    >
                                    </div>
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Start Date / End Date</strong
                                    ><br />
                                    <span style="color: #2e263de5">${new Date(action.startDate).toLocaleDateString() || 'N/A'} - ${new Date(action.endDate).toLocaleDateString() || 'N/A'}</span>
                                    </div>
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Evidence</strong><br />
                                    <span style="color: #2e263de5">${action?.docfile ? 'Attached' : 'N/A'}</span>
                                    </div>
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Strategy</strong><br />
                                    <span style="color: #2e263de5">${action?.cause ? 'Attached' : 'N/A'}</span>
                                    </div>
                            </div>
                            <div class="row mt-2">
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Budget</strong><br />
                                    <span
                                            class="badge p-2"
                                            style="background-color: #f8cecc; color: #2e263de5"
                                 >${action.budget || 'N/A'}</span
                                    >
                                    </div>
                            </div>
                           
    
                    </div>`)
        .join('')}


                    </div>
            </section>

           
            </section>
            </div>
    </body>
    </html>

`;
    return htmlContent;
};
exports.pdfTemplate = pdfTemplate;
const pdfTemplateforMutiples = async (libraries) => {
    console.log('Generating PDF for multiple libraries:', libraries);
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
         ${libraries.map((findLibrary, index) => `
         <div key=${index} class="container my-4">
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
                            <img src="https://res.cloudinary.com/dsqe9zgox/image/upload/v1755506975/logo_srvvol.png" alt="Logo" style="height: 20px" />
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
                                    >Risk Name</strong
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
                                 ${findLibrary?.managers
        ?.map((member) => `
                                 <tr>
                                    <td>
                                            <img
                                            src="${member?.profilePicture}"
                                            class="rounded-circle"
                                            style="height: 30px; width: 30px"
                                            />
                                            ${member.name || 'N/A'}
                                    </td>
                                    <td>${member?.role || 'N/A'}</td>
                                    <td>${member.email || 'N/A'}</td>
                                    </tr>`)
        .join('')}
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
                                 ${findLibrary?.members
        ?.map((member) => `
                                 <tr>
                                    <td>
                                            <img
                                            src="${member?.profilePicture}"
                                            class="rounded-circle"
                                            style="height: 30px; width: 30px"
                                            />
                                            ${member.name || 'N/A'}
                                    </td>
                                    <td>${member?.role || 'N/A'}</td>
                                    <td>${member.email || 'N/A'}</td>
                                    </tr>`)
        .join('')}
                            </tbody>
                            </table>
                    </div>
                    </div>
            </section>

            <!-- SECTION 2 -->
            <section class="mb-5">
                    <div class="card shadow-sm">
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
                                    >Action Open</strong
                                    ><br />${findLibrary?.openActions || 0}
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
                                    >Action Closed</strong
                                    ><br />${findLibrary?.closedActions || 0}
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
                            Progress Tracking <span class="float-end">$${((findLibrary?.closedActions || 0) /
        ((findLibrary?.inProgressActions || 0) +
            (findLibrary?.openActions || 0) +
            (findLibrary?.closedActions || 0))) *
        100 || 0}%</span>
                            </h6>
                    </div>
                    <div class="p-3">

                            ${findLibrary?.actions
        ?.map((action) => `
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
                                 ${action.assignedTo ? action.assignedTo?.map((user) => user.name).join(', ') : 'N/A'}
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
                                    <strong style="font-weight: 500">Personnel</strong><br />
                                    <span
                                            class="badge p-2"
                                            style="background-color: #f8cecc; color: #2e263de5"
                                            >${action.personnel || 'N/A'}</span
                                    >
                                    </div>
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Start Date / End Date</strong
                                    ><br />
                                    <span style="color: #2e263de5">${new Date(action.startDate).toLocaleDateString() || 'N/A'} - ${new Date(action.endDate).toLocaleDateString() || 'N/A'}</span>
                                    </div>
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Evidence</strong><br />
                                    <span style="color: #2e263de5">${action?.docfile ? 'Attached' : 'N/A'}</span>
                                    </div>
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Linked Root Cause</strong><br />
                                    <span style="color: #2e263de5">${action?.cause ? 'Attached' : 'N/A'}</span>
                                    </div>
                            </div>
                            <div class="row mt-2">
                                    <div class="col-3">
                                    <strong style="font-weight: 500">Budget</strong><br />
                                    <span
                                            class="badge p-2"
                                            style="background-color: #f8cecc; color: #2e263de5"
                                 >${action.budget || 'N/A'}</span
                                    >
                                    </div>
                            </div>
                        
    
                    </div>`)
        .join('')}


                    </div>
            </section>
            </div>`)}
    </body>
    </html>

        `;
    return htmlContent;
};
exports.pdfTemplateforMutiples = pdfTemplateforMutiples;
