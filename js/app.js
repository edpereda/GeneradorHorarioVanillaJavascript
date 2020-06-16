//imports
import {Subject} from './Subject.js'
import {Ui} from './Ui.js'
import {listSubjects,listSubjectsForCombination,listOfListsSubjects} from './listSubjects.js'

//Constants
let addSubjectForm = document.querySelector('#addSubjectForm');
let buttonGenerateSchedules = document.querySelector('#buttonGenerateSchedules');
let btnClean = document.querySelector('#btnClean');
const ui = new Ui();

//EventListeners
addSubjectForm.addEventListener('submit',addSubject);
buttonGenerateSchedules.addEventListener('click',generateSchedules);
btnClean.addEventListener('click',cleanFields);

initPage();
function initPage (){   
    document.addEventListener('DOMContentLoaded',getSubjectsLocalStorage);
}

//Functions
// Cleans all the fields in the form
function cleanFields (event){
    event.preventDefault();
    ui.cleanFields();
    ui.divNotificationAlert('Todos los campos han sido vaciados');
}
// Add a subject to the list and updates table of subjects added
function addSubject (event) {
    event.preventDefault();

    // Get Form values  name: string, group: string, teacher: string, time: number
    const subjectName = document.querySelector('#subjectName').value;
    const subjectGroup = document.querySelector('#subjectGroup').value;
    const subjectTeacher = document.querySelector('#subjectTeacher').value;

    const mondayStartHour = parseInt(document.querySelector('#mondayStartHour').value.replace(":",""));
    const tuesdayStartHour = parseInt(document.querySelector('#tuesdayStartHour').value.replace(":",""));    
    const wednesdayStartHour = parseInt(document.querySelector('#wednesdayStartHour').value.replace(":",""));    
    const thursdayStartHour = parseInt(document.querySelector('#thursdayStartHour').value.replace(":",""));    
    const fridayStartHour = parseInt(document.querySelector('#fridayStartHour').value.replace(":",""));    
    
    const mondayFinishHour = parseInt(document.querySelector('#mondayFinishHour').value.replace(":",""));
    const tuesdayFinishHour = parseInt(document.querySelector('#tuesdayFinishHour').value.replace(":",""));    
    const wednesdayFinishHour = parseInt(document.querySelector('#wednesdayFinishHour').value.replace(":",""));    
    const thursdayFinishHour = parseInt(document.querySelector('#thursdayFinishHour').value.replace(":",""));    
    const fridayFinishHour = parseInt(document.querySelector('#fridayFinishHour').value.replace(":",""));
    
    // console.log(mondayStartHour);
    
    if (subjectName!=""){

        // Create object "newSubject"
        let newSubject = new    Subject(subjectName,subjectGroup,subjectTeacher,
                                        mondayStartHour,tuesdayStartHour,wednesdayStartHour,thursdayStartHour,fridayStartHour,
                                        mondayFinishHour,tuesdayFinishHour,wednesdayFinishHour,thursdayFinishHour,fridayFinishHour);
     
        // Add newSubject to listSubjects
        listSubjects.push(newSubject);
    
        // Updates Added Subjects table
        updateTableAddedSubjects();
    
        ui.cleanFields();
        ui.divNotificationSuccess('Materia Agregada Correctamente');
    }
}

// Cleans, updates the table of subjects and add subjects to localStorage
function updateTableAddedSubjects(){
    let tableAddedSubjects = document.querySelector('#tableAddedSubjects tbody');

    // Clean the table
    ui.cleanTableSubjects();

    // Add subjects to table
    listSubjects.forEach((subject,index) => {
        ui.addSubjectToTable(subject,index,tableAddedSubjects);
    });
   
    // Add subjects to LocalStorage
    addSubjectsLocalStorage();
}

// Add a subjects to local storage
function addSubjectsLocalStorage(){
    
    // Added array to LocalStorage
    localStorage.setItem('GeneradorHorarios', JSON.stringify(listSubjects));
}

// Retrieve subjects from local storage and adds them to table of subjects
function getSubjectsLocalStorage(){
    // Get localStorage and is assigned to subjects
    let local = localStorage.getItem('GeneradorHorarios');
    //console.log(`local: ${local}`);
    
    let subjects = JSON.parse(local);
    //console.log(`subjects: ${subjects}`);
    
    // subjects objects convert to subject class and added to the list
    subjects.forEach((subject,index) => {
        //console.log(subject.mondaystarthour);
        
        let newSubject = new Subject(subject.name,subject.group,subject.teacher);
            newSubject.setMondayStartHour(subject.mondaystarthour);
            newSubject.setTuesdayStartHour(subject.tuesdaystarthour);
            newSubject.setWednesdayStartHour(subject.wednesdaystarthour);
            newSubject.setThursdayStartHour(subject.thursdaystarthour);
            newSubject.setFridayStartHour(subject.fridaystarthour);

            newSubject.setMondayFinishHour(subject.mondayfinishhour);
            newSubject.setTuesdayFinishHour(subject.tuesdayfinishhour);
            newSubject.setWednesdayFinishHour(subject.wednesdayfinishhour);
            newSubject.setThursdayFinishHour(subject.thursdayfinishhour);
            newSubject.setFridayFinishHour(subject.fridayfinishhour);
        
            //console.log(newSubject);
            
        listSubjects.push(newSubject);
    });

    // table of subjects is updated with localStorage subjects
    updateTableAddedSubjects();
    
}

// Apply two filters and creates schedules from selected subjects
function generateSchedules(event){
    event.preventDefault();

    // Cleans listSubjectsForCombination
    while(listSubjectsForCombination.pop());

    // Add subjects to listSubjectsForCombination
    listSubjects.forEach((subject,index)=>{
        let checkboxMark = document.querySelector(`#checkbox${index}`);
        
        if (checkboxMark.checked){
            listSubjectsForCombination.push(subject);
        }
    });

    // Filter create schedule from 3 or more subjects
    if(listSubjectsForCombination.length>=3){
        // FIRST STEP: Generate lists, if subjects is duplicated, create two lists for each subject and push to listOfListsSubjects
        //console.log(listSubjectsForCombination);        // *Bug

        // Create an array
        let listOfListsSubjects = [];
        // Add all subjects to first spot of the array
        listOfListsSubjects.push(listSubjectsForCombination);
        // First filter
        filterForDuplicatedSubjects(listOfListsSubjects);
        //console.log(listOfListsSubjects);
        
        // SECOND STEP: Erase lists which have overlapping schedules
        let finalList = listOfListsSubjects.slice();
        //console.log(finalList);
        
        filterOverlapping(finalList);   //Hours start at the same hour
        filterOverlapping2(finalList);   //Hours finish at the same hour
        filterOverlapping3(finalList);   //Hour subject1 starts or finishes in the middle of subject 2
        filterOverlapping4(finalList);   //Hour subject2 starts or finishes in the middle of subject 1
        
        
        // Show generated schedules on new tab
        ui.showSchedules(finalList);

        // Notification DIV
        let divSchedulesGenerated = document.querySelector('#divSchedulesGenerated tbody');
        try {
            if (divSchedulesGenerated.hasChildNodes()){
                ui.divNotificationSuccess('Horarios Generados CORRECTAMENTE')
            }
        } catch (error) {}
        
    }
}

// Creates two arrays if a subject name is duplicated
function filterForDuplicatedSubjects(listOfListsSubjects){
    
    listOfListsSubjects.forEach((list,indexListOfListsSubjects) => {
        for (let index1 = 0; index1 < list.length; index1++){
            for (let index2 = index1+1; index2 < list.length; index2++){
                
                 if(list[index1].getName().localeCompare(list[index2].getName())==0){ //If Subjects have same name
                    
                    let subject1 = list[index1];
                    let subject2 = list[index2];

                    // console.log(subject1);
                    // console.log(subject2);
                    
                    let newList1 = list.slice();
                    let newList2 = list.slice();

                    newList1.splice(index1,1);
                    newList2.splice(index2,1);

                    listOfListsSubjects.push(newList2);
                    listOfListsSubjects.push(newList1);

                    listOfListsSubjects.splice(indexListOfListsSubjects,1);
                    //console.log(listOfListsSubjects);

                    // Recursitiviy
                    filterForDuplicatedSubjects(listOfListsSubjects);
                }

            }
        }
    });    
    
}

//FIRST FILTER: SUBJECTS START AT SAME HOUR
function filterOverlapping(finalList){
    // Notification DIV
    let divSchedulesGenerated = document.querySelector('#divSchedulesGenerated tbody');
    
    // Go through each schedule
    finalList.forEach((schedule,indexSchedule)=>{
        let overlapping = false;

        for (let index1 = 0; index1 < schedule.length; index1++){
            for (let index2 = index1+1; index2 < schedule.length; index2++){
                
                let MondayStartSubject1 = schedule[index1].getMondayStartHour();
                let MondayStartSubject2 = schedule[index2].getMondayStartHour();

                let TuesdayStartSubject1 = schedule[index1].getTuesdayStartHour();
                let TuesdayStartSubject2 = schedule[index2].getTuesdayStartHour();

                let WednesdayStartSubject1 = schedule[index1].getWednesdayStartHour();
                let WednesdayStartSubject2 = schedule[index2].getWednesdayStartHour();
                
                let ThursdayStartSubject1 = schedule[index1].getThursdayStartHour();
                let ThursdayStartSubject2 = schedule[index2].getThursdayStartHour();
                
                let FridayStartSubject1 = schedule[index1].getFridayStartHour();
                let FridayStartSubject2 = schedule[index2].getFridayStartHour();

                //  console.log(schedule[index1]);
                //  console.log(TuesdayStartSubject1);

                //  console.log(schedule[index2]);
                //  console.log(TuesdayStartSubject2);

                // Both Mondays are not null
                if(MondayStartSubject1 && MondayStartSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(MondayStartSubject1 == MondayStartSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN LUNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping(finalList);
                        break;
                    }
                }
                
                // Both Tuesdays are not null
                if(TuesdayStartSubject1 && TuesdayStartSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(TuesdayStartSubject1 == TuesdayStartSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MARTES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping(finalList);
                        break;
                    }
                }

                // Both Wednesdays are not null
                if(WednesdayStartSubject1 && WednesdayStartSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(WednesdayStartSubject1 == WednesdayStartSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MIERCOLES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping(finalList);
                        break;
                    }
                }

                // Both Thursdays are not null
                if(ThursdayStartSubject1 && ThursdayStartSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(ThursdayStartSubject1 == ThursdayStartSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN JUEVES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping(finalList);
                        break;
                    }
                }

                // Both Fridays are not null
                if(FridayStartSubject1 && FridayStartSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(FridayStartSubject1 == FridayStartSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN VIERNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping(finalList);
                        break;
                    }
                }

                //console.log('NO rompio for dentro');
            }//for index2
            if(overlapping){
                break;
            }
            //console.log('No rompio for fuera');
        }//for index1
    });//forEach
}

//SECOND FILTER: SUBJECTS FINISH AT SAME HOUR
function filterOverlapping2(finalList){
    // Go through each schedule
    finalList.forEach((schedule,indexSchedule)=>{
        let overlapping = false;

        for (let index1 = 0; index1 < schedule.length; index1++){
            for (let index2 = index1+1; index2 < schedule.length; index2++){
                
                let MondayFinishSubject1 = schedule[index1].getMondayFinishHour();
                let MondayFinishSubject2 = schedule[index2].getMondayFinishHour();

                let TuesdayFinishSubject1 = schedule[index1].getTuesdayFinishHour();
                let TuesdayFinishSubject2 = schedule[index2].getTuesdayFinishHour();

                let WednesdayFinishSubject1 = schedule[index1].getWednesdayFinishHour();
                let WednesdayFinishSubject2 = schedule[index2].getWednesdayFinishHour();
                
                let ThursdayFinishSubject1 = schedule[index1].getThursdayFinishHour();
                let ThursdayFinishSubject2 = schedule[index2].getThursdayFinishHour();
                
                let FridayFinishSubject1 = schedule[index1].getFridayFinishHour();
                let FridayFinishSubject2 = schedule[index2].getFridayFinishHour();

                //  console.log(schedule[index1]);
                //  console.log(WednesdayFinishSubject1);

                //  console.log(schedule[index2]);
                //  console.log(WednesdayFinishSubject2);

                // Both Mondays are not null
                if(MondayFinishSubject1 && MondayFinishSubject2){
                    //console.log('Ambos no son nulos');
                    // Both finish at the same hour
                    if(MondayFinishSubject1 == MondayFinishSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN LUNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping2(finalList);
                        break;
                    }
                }
                
                // Both Tuesdays are not null
                if(TuesdayFinishSubject1 && TuesdayFinishSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(TuesdayFinishSubject1 == TuesdayFinishSubject2){
                        overlapping = true;
                        
                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MARTES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping2(finalList);
                        break;
                    }
                }

                // Both Wednesdays are not null
                if(WednesdayFinishSubject1 && WednesdayFinishSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(WednesdayFinishSubject1 == WednesdayFinishSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MIERCOLES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping2(finalList);
                        break;
                    }
                }

                // Both Thursdays are not null
                if(ThursdayFinishSubject1 && ThursdayFinishSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(ThursdayFinishSubject1 == ThursdayFinishSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN JUEVES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping2(finalList);
                        break;
                    }
                }

                // Both Fridays are not null
                if(FridayFinishSubject1 && FridayFinishSubject2){
                    //console.log('Ambos no son nulos');
                    // Both are at the same hour
                    if(FridayFinishSubject1 == FridayFinishSubject2){
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN VIERNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        filterOverlapping2(finalList);
                        break;
                    }
                }

                //console.log('NO rompio for dentro');
            }//for index2
            if(overlapping){
                break;
            }
            //console.log('No rompio for fuera');
        }//for index1
    });//forEach
}

//THIRD FILTER: SUBJECT1 STARTS OR FINISHES IN THE MIDDLE OF SUBJECT2
function filterOverlapping3(finalList){
    // Go through each schedule
    finalList.forEach((schedule,indexSchedule)=>{
        let overlapping = false;
        for (let index1 = 0; index1 < schedule.length; index1++){
            for (let index2 = index1+1; index2 < schedule.length; index2++){
                //Start hour
                let MondayStartSubject1 = schedule[index1].getMondayStartHour();
                let MondayStartSubject2 = schedule[index2].getMondayStartHour();

                let TuesdayStartSubject1 = schedule[index1].getTuesdayStartHour();
                let TuesdayStartSubject2 = schedule[index2].getTuesdayStartHour();

                let WednesdayStartSubject1 = schedule[index1].getWednesdayStartHour();
                let WednesdayStartSubject2 = schedule[index2].getWednesdayStartHour();
                
                let ThursdayStartSubject1 = schedule[index1].getThursdayStartHour();
                let ThursdayStartSubject2 = schedule[index2].getThursdayStartHour();
                
                let FridayStartSubject1 = schedule[index1].getFridayStartHour();
                let FridayStartSubject2 = schedule[index2].getFridayStartHour();

                //Finish hour
                let MondayFinishSubject1 = schedule[index1].getMondayFinishHour();
                let MondayFinishSubject2 = schedule[index2].getMondayFinishHour();

                let TuesdayFinishSubject1 = schedule[index1].getTuesdayFinishHour();
                let TuesdayFinishSubject2 = schedule[index2].getTuesdayFinishHour();

                let WednesdayFinishSubject1 = schedule[index1].getWednesdayFinishHour();
                let WednesdayFinishSubject2 = schedule[index2].getWednesdayFinishHour();
                
                let ThursdayFinishSubject1 = schedule[index1].getThursdayFinishHour();
                let ThursdayFinishSubject2 = schedule[index2].getThursdayFinishHour();
                
                let FridayFinishSubject1 = schedule[index1].getFridayFinishHour();
                let FridayFinishSubject2 = schedule[index2].getFridayFinishHour();

                //  console.log(schedule[index1]);
                //  console.log(MondayStartSubject1);

                //  console.log(schedule[index2]);
                //  console.log(MondayStartSubject2);

                //Starts or Finishes Subject1 in the middle of Subject2
                //Mondays aren't null
                if (MondayStartSubject1 && MondayFinishSubject1 && MondayStartSubject2 && MondayFinishSubject2){
                    // console.log("Ninguno es nulo");
                    //compare
                    if (MondayStartSubject1 > MondayStartSubject2 && MondayStartSubject1 < MondayFinishSubject2){//subject1 starts in the middle of subject2
                        overlapping = true;

                        //pop from finalList
                        // console.log('Saco de finalList IF1');

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN LUNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);
                        
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                    if(MondayFinishSubject1 > MondayStartSubject2 && MondayFinishSubject1 < MondayFinishSubject2){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //pop from finalList
                        // console.log('Saco de finalList IF2');

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN LUNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                //Tuesdays aren't null
                if (TuesdayStartSubject1 && TuesdayFinishSubject1 && TuesdayStartSubject2 && TuesdayFinishSubject2){
                    //compare
                    if (TuesdayStartSubject1 > TuesdayStartSubject2 && TuesdayStartSubject1 < TuesdayFinishSubject2){//subject1 starts in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MARTES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }else if(TuesdayFinishSubject1 > TuesdayStartSubject2 && TuesdayFinishSubject1 < TuesdayFinishSubject2){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MARTES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }

                //Wednesdays aren't null
                if (WednesdayStartSubject1 && WednesdayFinishSubject1 && WednesdayStartSubject2 && WednesdayFinishSubject2){
                    //compare
                    if (WednesdayStartSubject1 > WednesdayStartSubject2 && WednesdayStartSubject1 < WednesdayFinishSubject2){//subject1 starts in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MIERCOLES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }else if(WednesdayFinishSubject1 > WednesdayStartSubject2 && WednesdayFinishSubject1 < WednesdayFinishSubject2){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MIERCOLES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                
                //Thursdays aren't null
                if (ThursdayStartSubject1 && ThursdayFinishSubject1 && ThursdayStartSubject2 && ThursdayFinishSubject2){
                    //compare
                    if (ThursdayStartSubject1 > ThursdayStartSubject2 && ThursdayStartSubject1 < ThursdayFinishSubject2){//subject1 starts in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN JUEVES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }else if(ThursdayFinishSubject1 > ThursdayStartSubject2 && ThursdayFinishSubject1 < ThursdayFinishSubject2){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN JUEVES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }

                //Fridays aren't null
                if (FridayStartSubject1 && FridayFinishSubject1 && FridayStartSubject2 && FridayFinishSubject2){
                    //compare
                    if (FridayStartSubject1 > FridayStartSubject2 && FridayStartSubject1 < FridayFinishSubject2){//subject1 starts in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN VIERNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }else if(FridayFinishSubject1 > FridayStartSubject2 && FridayFinishSubject1 < FridayFinishSubject2){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN VIERNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }

            }//forindex2
            if(overlapping){
                break;
            }
        }//forindex1
    });//forEach
}

//FOURTH FILTER: SUBJECT2 STARTS OR FINISHES IN THE MIDDLE OF SUBJECT1
function filterOverlapping4(finalList){
    // Go through each schedule
    finalList.forEach((schedule,indexSchedule)=>{
        let overlapping = false;
        for (let index1 = 0; index1 < schedule.length; index1++){
            for (let index2 = index1+1; index2 < schedule.length; index2++){
                //Start hour
                let MondayStartSubject1 = schedule[index1].getMondayStartHour();
                let MondayStartSubject2 = schedule[index2].getMondayStartHour();

                let TuesdayStartSubject1 = schedule[index1].getTuesdayStartHour();
                let TuesdayStartSubject2 = schedule[index2].getTuesdayStartHour();

                let WednesdayStartSubject1 = schedule[index1].getWednesdayStartHour();
                let WednesdayStartSubject2 = schedule[index2].getWednesdayStartHour();
                
                let ThursdayStartSubject1 = schedule[index1].getThursdayStartHour();
                let ThursdayStartSubject2 = schedule[index2].getThursdayStartHour();
                
                let FridayStartSubject1 = schedule[index1].getFridayStartHour();
                let FridayStartSubject2 = schedule[index2].getFridayStartHour();

                //Finish hour
                let MondayFinishSubject1 = schedule[index1].getMondayFinishHour();
                let MondayFinishSubject2 = schedule[index2].getMondayFinishHour();

                let TuesdayFinishSubject1 = schedule[index1].getTuesdayFinishHour();
                let TuesdayFinishSubject2 = schedule[index2].getTuesdayFinishHour();

                let WednesdayFinishSubject1 = schedule[index1].getWednesdayFinishHour();
                let WednesdayFinishSubject2 = schedule[index2].getWednesdayFinishHour();
                
                let ThursdayFinishSubject1 = schedule[index1].getThursdayFinishHour();
                let ThursdayFinishSubject2 = schedule[index2].getThursdayFinishHour();
                
                let FridayFinishSubject1 = schedule[index1].getFridayFinishHour();
                let FridayFinishSubject2 = schedule[index2].getFridayFinishHour();

                 console.log(schedule[index1]);
                 console.log(MondayStartSubject1);

                 console.log(schedule[index2]);
                 console.log(MondayStartSubject2);

                //Starts or Finishes Subject1 in the middle of Subject2
                //Mondays aren't null
                if (MondayStartSubject1 && MondayFinishSubject1 && MondayStartSubject2 && MondayFinishSubject2){
                    console.log("Ninguno es nulo");
                    //compare
                    if (MondayStartSubject2 > MondayStartSubject1 && MondayStartSubject2 < MondayFinishSubject1){//subject2 starts in the middle of subject1
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN LUNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF1');
                        
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                    if(MondayFinishSubject2 > MondayStartSubject1 && MondayFinishSubject2 < MondayFinishSubject1){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN LUNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF2');

                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                
                //Tuesdays aren't null
                if (TuesdayStartSubject1 && TuesdayFinishSubject1 && TuesdayStartSubject2 && TuesdayFinishSubject2){
                    console.log("Ninguno es nulo");
                    //compare
                    if (TuesdayStartSubject2 > TuesdayStartSubject1 && TuesdayStartSubject2 < TuesdayFinishSubject1){//subject2 starts in the middle of subject1
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MARTES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF1');
                        
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                    if(TuesdayFinishSubject2 > TuesdayStartSubject1 && TuesdayFinishSubject2 < TuesdayFinishSubject1){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MARTES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF2');

                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                
                //Wednesdays aren't null
                if (WednesdayStartSubject1 && WednesdayFinishSubject1 && WednesdayStartSubject2 && WednesdayFinishSubject2){
                    console.log("Ninguno es nulo");
                    //compare
                    if (WednesdayStartSubject2 > WednesdayStartSubject1 && WednesdayStartSubject2 < WednesdayFinishSubject1){//subject2 starts in the middle of subject1
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MIERCOLES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF1');
                        
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                    if(WednesdayFinishSubject2 > WednesdayStartSubject1 && WednesdayFinishSubject2 < WednesdayFinishSubject1){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN MIERCOLES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF2');

                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                
                //Mondays aren't null
                if (ThursdayStartSubject1 && ThursdayFinishSubject1 && ThursdayStartSubject2 && ThursdayFinishSubject2){
                    console.log("Ninguno es nulo");
                    //compare
                    if (ThursdayStartSubject2 > ThursdayStartSubject1 && ThursdayStartSubject2 < ThursdayFinishSubject1){//subject2 starts in the middle of subject1
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN JUEVES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF1');
                        
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                    if(ThursdayFinishSubject2 > ThursdayStartSubject1 && ThursdayFinishSubject2 < ThursdayFinishSubject1){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN JUEVES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF2');

                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                
                //Fridays aren't null
                if (FridayStartSubject1 && FridayFinishSubject1 && FridayStartSubject2 && FridayFinishSubject2){
                    console.log("Ninguno es nulo");
                    //compare
                    if (FridayStartSubject2 > FridayStartSubject1 && FridayStartSubject2 < FridayFinishSubject1){//subject2 starts in the middle of subject1
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN VIERNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF1');
                        
                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                    if(FridayFinishSubject2 > FridayStartSubject1 && FridayFinishSubject2 < FridayFinishSubject1){//subject1 finishes in the middle of subject2
                        overlapping = true;

                        //NOTIFICATION DIV
                        ui.divNotificationAlert(`Horarios no generados. TRASLAPE EN VIERNES. ${schedule[index1].getName()} traslapa con ${schedule[index2].getName()}`);

                        //pop from finalList
                        console.log('Saco de finalList IF2');

                        finalList.splice(indexSchedule,1);
                        //filterOverlapping(finalList);
                        break;
                    }
                }
                

            }//forindex2
            if(overlapping){
                break;
            }
        }//forindex1
    });//forEach
}