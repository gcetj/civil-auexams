//const deptElement = document.getElementById("dept");
const subCodesElement = document.getElementById("subCode");
const yearElement = document.getElementById("year");
const errElement = document.getElementById("errMessage");
const uploadMessageElement = document.getElementById("uploadMessage");
const regulationElement = document.getElementById("regulation");
const form = document.getElementById('form');

var d = new Date();

const subCodes = {
    "2013": ["HS6151","MA6151","PH6151","CY6151","GE6151","GE6152","HS6251","MA6251","PH6251","CY6251","GE6252","GE6253","MA6351","GE6351","GE6301","CE6302","CE6303","CE6304","MA6459","CE6401","CE6402","CE6403","CE6404","CE6405","CE6501","CE6502","CE6503","CE6504","CE6505","CE6506","CE6601","CE6602","CE6603","CE6604","CE6605","CE6001","CE6002","CE6701","CE6702","CE6703","CE6006","EN6501","MG6851","CE6016","CE6021"],
    "2017": ["HS8151","MA8151","PH8151","CY8151","GE8151","GE8152","HS8251","MA8251","PH8201","BE8251","GE8291","GE8292","MA8353","CE8301","CE8302","CE8351","CE8391","CE8392","MA8491","CE8401","CE8402","CE8403","CE8404","CE8491","CE8501","CE8502","EN8491","CE8591","GE8071","OA1551","CE8601","CE8602","CE8603","CE8604","EN8592","CE8005","CE8701","CE8702","CE8703","EN8591","OTT752","GE8076","GE8020"]
};

function changeRegulation() {
    subCodesElement.innerHTML = '';

    let optionsInsert = '';
    //console.log(optionsInsert);
    let option = document.createElement('option');
    option.text = '--Select one--';
    option.value = "none";
    subCodesElement.append(option);
    //optionsInsert.concat(option);
    //console.log(optionsInsert);

    let subjectCodes = subCodes[regulationElement.value].sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
        optionsInsert.concat(option);
    }
    // console.log(optionsInsert);
    // subCodesElement.innerHTML = optionsInsert;
}

function deptChange(e) {
    subCodesElement.innerHTML = '';
    //let department = deptElement.value;
    
    let option = document.createElement('option');
    option.text = "--Select one--";
    option.value = "none";
    subCodesElement.append(option);

    let subjectCodes = subCodes.sort();

    for(let i = 0; i < subjectCodes.length; i++) {
        let option = document.createElement('option');
        option.text = subjectCodes[i];
        option.value = subjectCodes[i];
        subCodesElement.append(option);
    }
}

const checkInputs = () => {
    if (subCodesElement.value == "none" || yearElement.value == "none") {
        alert("Invalid year or subject code");
        return false;
    }
    return true;
}

const checkTime = () => {
    console.log("Checking the time");
    if (!(d.getHours() >= 13 && d.getHours() <= 14 || d.getHours() >= 18 && d.getHours() <= 22)) {
        errElement.style.display = "block";
        enabled = false;
        return false;
    }
    return true;
}

const checkFileNaming = (filename) => {
    let pdfCheck = filename.split(".");
    if(pdfCheck[1] != "pdf" && pdfCheck[1] != "PDF") {
        alert("Only pdf files are accepted");
        return false;
    }

    let filenaming = filename.split("-");
    console.log(filenaming);
    if (filenaming.length != 2 || filenaming[0].length != 12 || filenaming[1].length != 10) {
        alert("File name is not proper");
        alert("File name should in the format [Reg.No]-[Sub.Code] (all uppercase)");
        return false;
    }

    return true;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    
    console.log(checkInputs());

    if (!checkInputs()) {
        return;
    }   

    if (!confirm("Sure to submit?")) {
        return;
    }

    if (form.filename.value.length != 12) {
        alert("Check your register number");
        return;
    }

    // if (!checkTime()) {
    //     alert("Answer Submission Time exceeded! Contact your Supervisor");
    //     return;
    // }
    const file = form.file.files[0];
    const fr = new FileReader();
    var d = new Date();

    try {
        fr.readAsArrayBuffer(file);
    } catch(err) {
        alert("Please make sure you selected the correct file or contact your supervisor");
        uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
        uploadMessageElement.style.display = 'block';
    }

    fr.onload = f => {

        if (!checkFileNaming(file.name)) {
            return;
        }
        
        uploadMessageElement.innerHTML = "Uploading... Please Wait!"
        uploadMessageElement.style.display = 'block';

        let fileName = file.name;

        let url = "https://script.google.com/macros/s/AKfycbwfDQP03sfCs493LnXvcY-vms8YZMxCHIRkLcWI2_t-SZVbCPxk72cgdjWsJ-gF2yA-Lg/exec";

        const qs = new URLSearchParams({filename: fileName, mimeType: file.type, subCode: form.subCode.value});
        console.log(`${url}?${qs}`);
        fetch(`${url}?${qs}`, {method: "POST", body: JSON.stringify([...new Int8Array(f.target.result)])})
        .then(res => res.json())
        .then(e => {
            console.log(e);
            if (e.commonFolder) {
                alert("It seems like your file went to the wrong folder. Contact the supervisor");
            }
            alert("File uploaded successfully!");
            form.reset();
            uploadMessageElement.innerHTML = 'UPLOADED SUCCESSFULLY';
            uploadMessageElement.style.display = 'block';
        })  // <--- You can retrieve the returned value here.
        .catch(err => {
            console.log(err);
            uploadMessageElement.innerHTML = 'UPLOADING FAILED';
            alert("Something went Wrong! Please Try again!");
            uploadMessageElement.style.display = 'block';
        });
    }
});