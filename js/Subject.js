export class Subject {
    constructor(name,group,teacher,
                mondaystarthour,tuesdaystarthour,wednesdaystarthour,thursdaystarthour,fridaystarthour,
                mondayfinishhour,tuesdayfinishhour,wednesdayfinishhour,thursdayfinishhour,fridayfinishhour){
        this.name = name;
        this.group = group;
        this.teacher = teacher;

        this.mondaystarthour = mondaystarthour;
        this.tuesdaystarthour = tuesdaystarthour;
        this.wednesdaystarthour = wednesdaystarthour;
        this.thursdaystarthour = thursdaystarthour;
        this.fridaystarthour = fridaystarthour;

        this.mondayfinishhour = mondayfinishhour;
        this.tuesdayfinishhour = tuesdayfinishhour;
        this.wednesdayfinishhour = wednesdayfinishhour;
        this.thursdayfinishhour = thursdayfinishhour;
        this.fridayfinishhour = fridayfinishhour;
    }
    
    // Getters

    getName () {return this.name;}
    getGroup () {return this.group;}
    getTeacher () {return this.teacher;}

    getMondayStartHour () {return this.mondaystarthour;}
    getTuesdayStartHour () {return this.tuesdaystarthour;}
    getWednesdayStartHour () {return this.wednesdaystarthour;}
    getThursdayStartHour () {return this.thursdaystarthour;}
    getFridayStartHour () {return this.fridaystarthour;}

    getMondayFinishHour () {return this.mondayfinishhour;}
    getTuesdayFinishHour () {return this.tuesdayfinishhour;}
    getWednesdayFinishHour () {return this.wednesdayfinishhour;}
    getThursdayFinishHour () {return this.thursdayfinishhour;}
    getFridayFinishHour () {return this.fridayfinishhour;}

    // Setters

    setName (name) {this.name = name;}
    setGroup (group) { this.group = group;}
    setTeacher (teacher) { this.teacher = teacher;}

    setMondayStartHour (hour) { this.mondaystarthour = hour; if(hour===null){this.mondaystarthour=''}}
    setTuesdayStartHour (hour) { this.tuesdaystarthour = hour; if(hour===null){this.tuesdaystarthour=''}}
    setWednesdayStartHour (hour) { this.wednesdaystarthour = hour; if(hour===null){this.wednesdaystarthour=''}}
    setThursdayStartHour (hour) { this.thursdaystarthour = hour; if(hour===null){this.thursdaystarthour=''}}
    setFridayStartHour (hour) { this.fridaystarthour = hour; if(hour===null){this.fridaystarthour=''}}

    setMondayFinishHour (hour) { this.mondayfinishhour = hour; if(hour===null){this.mondayfinishhour=''}}
    setTuesdayFinishHour (hour) { this.tuesdayfinishhour = hour; if(hour===null){this.tuesdayfinishhour=''}}
    setWednesdayFinishHour (hour) { this.wednesdayfinishhour = hour; if(hour===null){this.wednesdayfinishhour=''}}
    setThursdayFinishHour (hour) { this.thursdayfinishhour = hour; if(hour===null){this.thursdayfinishhour=''}}
    setFridayFinishHour (hour) { this.fridayfinishhour = hour; if(hour===null){this.fridayfinishhour=''}}

    // Prints subjects information
    showSubjectInfo () {
        console.log(`${this.name} ${this.group} ${this.teacher}\n
                    ${this.mondaystarthour} ${this.mondayfinishhour}`);
    }
}
