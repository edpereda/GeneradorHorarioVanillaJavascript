// Imports
import {listSubjects} from './listSubjects.js'
import {listSubjectsForCombination} from './listSubjects.js'
// Class
export class Ui {

    // Cleans the table to avoid data clonation in the table
    cleanTableSubjects () {
        let tableAddedSubjects = document.querySelector('#tableAddedSubjects tbody');

        while(listSubjectsForCombination.pop());

        while(tableAddedSubjects.hasChildNodes()){
            tableAddedSubjects.removeChild(tableAddedSubjects.firstChild);
        }
    }

    // Adds one subject to the table            //Bug selected subjects
    addSubjectToTable (subject,index,table) {

        // Create object and insert into table
            let trSubject = document.createElement("tr");
    
            let tdNumber = document.createElement("td");
            let tdGroup = document.createElement("td");
            let tdName = document.createElement("td");
            let tdTeacher = document.createElement("td");
    
            let tdMonday = document.createElement("td");
            let tdTuesday = document.createElement("td");
            let tdWednesday = document.createElement("td");
            let tdThursday = document.createElement("td");
            let tdFriday = document.createElement("td");

            let tdDelete = document.createElement("td");
            let buttonDelete = document.createElement("button");

            let tdCheckboxMark = document.createElement("td");
            let checkboxMark = document.createElement("input");
    
            // Add number to Subject
            tdNumber.innerHTML = `${index+1}`;
            // Add tdNumber to trSubject
            trSubject.appendChild(tdNumber);
    
            // Add info to td's
            tdGroup.innerHTML = `${subject.getGroup()}`;
            tdName.innerHTML = `${subject.getName()}`;
            tdTeacher.innerHTML = `${subject.getTeacher()}`;
    
            tdMonday.innerHTML = `${this.hourToString(subject.getMondayStartHour())} - ${this.hourToString(subject.getMondayFinishHour())}`;
            tdTuesday.innerHTML = `${this.hourToString(subject.getTuesdayStartHour())} - ${this.hourToString(subject.getTuesdayFinishHour())}`;
            tdWednesday.innerHTML = `${this.hourToString(subject.getWednesdayStartHour())} - ${this.hourToString(subject.getWednesdayFinishHour())}`;
            tdThursday.innerHTML = `${this.hourToString(subject.getThursdayStartHour())} - ${this.hourToString(subject.getThursdayFinishHour())}`;
            tdFriday.innerHTML = `${this.hourToString(subject.getFridayStartHour())} - ${this.hourToString(subject.getFridayFinishHour())}`;

            // Create delete button
            buttonDelete.className = 'btn-danger';
            buttonDelete.id = `${index+1}`;
            buttonDelete.innerHTML = 'X';
            buttonDelete.addEventListener("click",()=>{
                                            event.preventDefault();
                                            let tableAddedSubjects = document.querySelector('#tableAddedSubjects tbody');
                                            
                                            // Delete subject from listSubjects
                                            const index = parseInt(event.target.id)-1;
                                            listSubjects.splice(index,1);

                                            // Delete subject from listSubjectsForCombinations
                                            if(listSubjectsForCombination.length===1){    
                                                listSubjectsForCombination.pop();
                                            }
                                            listSubjectsForCombination.splice(index,1);
                                            
                                            // Update table Added Subjects
                                            while(tableAddedSubjects.hasChildNodes()){
                                                tableAddedSubjects.removeChild(tableAddedSubjects.firstChild);
                                            }
                                            
                                            listSubjects.forEach((subject,index) => {
                                                this.addSubjectToTable(subject,index,tableAddedSubjects);
                                            });

                                            // Added array to LocalStorage
                                            localStorage.setItem('GeneradorHorarios', JSON.stringify(listSubjects))
                                        });
            tdDelete.appendChild(buttonDelete);

            // Create checkbox 
            checkboxMark.className = 'form-check';
            checkboxMark.style = 'transform: scale(2.5)';
            checkboxMark.setAttribute('type','checkbox');
            checkboxMark.id = `checkbox${index}`;
            checkboxMark.value = `${index}`;
            checkboxMark.checked = 'true';
            
            tdCheckboxMark.appendChild(checkboxMark);

            // Add td´s to trSubject
            trSubject.appendChild(tdGroup);
            trSubject.appendChild(tdName);
            trSubject.appendChild(tdTeacher);
    
            trSubject.appendChild(tdMonday);
            trSubject.appendChild(tdTuesday);
            trSubject.appendChild(tdWednesday);
            trSubject.appendChild(tdThursday);
            trSubject.appendChild(tdFriday);

            // Add checkbox
            trSubject.appendChild(tdCheckboxMark);

            // Add delete button
            trSubject.appendChild(tdDelete);

    
            // Add trSubject to table
            table.appendChild(trSubject);
        
    }
    // Converts from number int to string. Only use for presentation of hours in table
    hourToString(numberHour) {

        // Specific case for localStorage Subjects which have undefined fields
        if (numberHour === undefined || numberHour == "" || numberHour == null|| isNaN(numberHour)){
            numberHour = "xxxx";
        }
        let stringHourBeg = numberHour.toString().slice(0,-2);
        let stringHourEnd = numberHour.toString().slice(-2,4);
    
        return `${stringHourBeg}:${stringHourEnd}`;
    }

    // Adds schedules to new page
    showSchedules(finalList) {
        console.log(finalList);
        let divSchedulesGenerated = document.querySelector('#divSchedulesGenerated');
        
        divSchedulesGenerated.innerHTML = ``;

        finalList.forEach((schedule,indexSchedule)=>{
            // console.log(schedule);
            let divHijo = document.createElement('div');

            divHijo.innerHTML =                 `
                                                <h3> Horario ${indexSchedule+1}: </h3>
                                                <table id="table${indexSchedule+1}" class="table">
                                                    <thead>
                                                    <tr>
                                                    <th>Numero</th><th>Grupo</th> <th>Nombre</th> <th>Profesor</th> <th>Lunes</th> <th>Martes</th> <th>Miercoles</th> <th>Jueves</th> <th>Viernes</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        <!-- Aqui se insertan las materias-->
                                                    </tbody>
                                                </table>
                                                <hr>`;

            divSchedulesGenerated.appendChild(divHijo);
            //console.log(divHijo);

            schedule.forEach((subject,indexSubject)=>{
                // console.log(subject.getGroup());

                let table = document.querySelector(`#table${indexSchedule+1} tbody`);
                    
                    // Create object and insert into table
                    let trSubject = document.createElement("tr");
            
                    let tdNumber = document.createElement("td");
                    let tdGroup = document.createElement("td");
                    let tdName = document.createElement("td");
                    let tdTeacher = document.createElement("td");
            
                    let tdMonday = document.createElement("td");
                    let tdTuesday = document.createElement("td");
                    let tdWednesday = document.createElement("td");
                    let tdThursday = document.createElement("td");
                    let tdFriday = document.createElement("td");

                    // Add number to Subject
                    tdNumber.innerHTML = `${indexSubject+1}`;
                    // Add tdNumber to trSubject
                    trSubject.appendChild(tdNumber);
            
                    // Add info to td's
                    tdGroup.innerHTML = `${subject.getGroup()}`;
                    tdName.innerHTML = `${subject.getName()}`;
                    tdTeacher.innerHTML = `${subject.getTeacher()}`;
            
                    tdMonday.innerHTML = `${this.hourToString(subject.getMondayStartHour())} - ${this.hourToString(subject.getMondayFinishHour())}`;
                    tdTuesday.innerHTML = `${this.hourToString(subject.getTuesdayStartHour())} - ${this.hourToString(subject.getTuesdayFinishHour())}`;
                    tdWednesday.innerHTML = `${this.hourToString(subject.getWednesdayStartHour())} - ${this.hourToString(subject.getWednesdayFinishHour())}`;
                    tdThursday.innerHTML = `${this.hourToString(subject.getThursdayStartHour())} - ${this.hourToString(subject.getThursdayFinishHour())}`;
                    tdFriday.innerHTML = `${this.hourToString(subject.getFridayStartHour())} - ${this.hourToString(subject.getFridayFinishHour())}`;

                    // Add td´s to trSubject
                    trSubject.appendChild(tdGroup);
                    trSubject.appendChild(tdName);
                    trSubject.appendChild(tdTeacher);
            
                    trSubject.appendChild(tdMonday);
                    trSubject.appendChild(tdTuesday);
                    trSubject.appendChild(tdWednesday);
                    trSubject.appendChild(tdThursday);
                    trSubject.appendChild(tdFriday);

                    // Add trSubject to table
                    table.appendChild(trSubject);
            });
            
        });
    }

    // Clean all fields of the form
    cleanFields(){
        document.querySelector('#subjectName').value = '';
        document.querySelector('#subjectGroup').value = '';
        document.querySelector('#subjectTeacher').value = '';

        document.querySelector('#mondayStartHour').value = '';
        document.querySelector('#tuesdayStartHour').value = '';    
        document.querySelector('#wednesdayStartHour').value = '';    
        document.querySelector('#thursdayStartHour').value = '';    
        document.querySelector('#fridayStartHour').value = '';    
        
        document.querySelector('#mondayFinishHour').value = '';
        document.querySelector('#tuesdayFinishHour').value = '';    
        document.querySelector('#wednesdayFinishHour').value = '';    
        document.querySelector('#thursdayFinishHour').value = '';    
        document.querySelector('#fridayFinishHour').value = '';
    }

    // Div notification Alert
    divNotificationAlert(cadena){
        let divNotification = document.querySelector('#divNotification');
        // console.log(divNotification);
        
        divNotification.className = 'alert alert-danger text-center';
        divNotification.innerHTML = `<h4>ALERTA:</h4>
                                    <p>${cadena}</p>`;
        divNotification.style.display = 'block';
        setTimeout(()=>{
            divNotification.style.display = 'none';
        },3000)
    }
    // Div notification Success
    divNotificationSuccess(cadena){
        let divNotification = document.querySelector('#divNotification');
        // console.log(divNotification);
        
        divNotification.className = 'alert alert-success text-center';
        divNotification.innerHTML = `<h4>Mensaje:</h4>
                                    <p>${cadena}</p>`;
        divNotification.style.display = 'block';
        setTimeout(()=>{
            divNotification.style.display = 'none';
        },3000)
    }
}