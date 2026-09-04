function getLocalDateKey(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(totalMin) {
    const h = Math.floor(totalMin / 60) % 24;
    const m = totalMin % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatTimeString(timeStr, locale, use12Hour) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const mStr = String(m).padStart(2, '0');

    if (use12Hour) {
        const period = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${String(h12).padStart(2, '0')}:${mStr} ${period}`;
    } else {
        const hStr = String(h).padStart(2, '0');
        return `${hStr}:${mStr}`;
    }
}

function formatDMMM(dateObj, locale) {
    if (!dateObj) return '';
    const day = dateObj.getDate();
    const monthShort = dateObj.toLocaleDateString(locale, { month: 'short' });
    const year = dateObj.getFullYear();
    return `${day} ${monthShort} ${year}`;
}

function getDayLabel(dayId) {
    const lang = STATE.settings.language;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    return t.daysShort[dayId] || DAY_KEYS.find(d => d.id === dayId)?.label || '';
}

function setPrintOrientation(isLandscape) {
    let printPageStyle = document.getElementById('printPageStyle');
    if (!printPageStyle) {
        printPageStyle = document.createElement('style');
        printPageStyle.id = 'printPageStyle';
        document.head.appendChild(printPageStyle);
    }
    printPageStyle.textContent = `@page { size: A4 ${isLandscape ? 'landscape' : 'portrait'}; margin: 0; }`;
}

function formatDate(dateObj, dateFormat, locale, shortDay = false) {
    if (!dateObj) return '';
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const monthShort = dateObj.toLocaleDateString(locale, { month: 'short' });
    const monthLong = dateObj.toLocaleDateString(locale, { month: 'long' });
    const weekDayShort = dateObj.toLocaleDateString(locale, { weekday: 'short' });

    if (shortDay) {
        if (dateFormat === 'D MMM YYYY' || dateFormat === 'D MMMM YYYY') {
            return `${dateObj.getDate()} ${monthShort}`;
        } else if (dateFormat === 'MM/DD/YYYY') {
            return `${month}/${day}`;
        } else if (dateFormat === 'YYYY-MM-DD') {
            return `${month}-${day}`;
        } else if (dateFormat === 'EEE, D MMM') {
            return `${weekDayShort}, ${dateObj.getDate()} ${monthShort}`;
        } else {
            return `${day}/${month}`;
        }
    }

    if (dateFormat === 'MM/DD/YYYY') {
        return `${month}/${day}/${year}`;
    } else if (dateFormat === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (dateFormat === 'DD-MM-YYYY') {
        return `${day}-${month}-${year}`;
    } else if (dateFormat === 'D MMMM YYYY') {
        return `${dateObj.getDate()} ${monthLong} ${year}`;
    } else if (dateFormat === 'EEE, D MMM') {
        return `${weekDayShort}, ${dateObj.getDate()} ${monthShort}`;
    } else {
        return `${dateObj.getDate()} ${monthShort} ${year}`;
    }
}

function isAppointmentCancelled(app) {
    if (!app) return false;

    if (app.cancelled === true || app.isCancelled === true) return true;

    const appType = (app.appointmentType || app.type || app.status || '').toLowerCase();
    if (appType.includes('cancel') || appType.includes('verval') || appType.includes('uitval')) {
        return true;
    }

    const textContent = ((app.changeDescription || '') + ' ' + (app.remark || '')).toLowerCase();
    const cancelKeywords = ['vervallen', 'vervalt', 'uitval', 'uitgevallen', 'geannuleerd', 'cancelled', 'canceled'];
    if (cancelKeywords.some(kw => textContent.includes(kw))) {
        return true;
    }

    const modKeywords = ['gewijzigd', 'lokaal', 'verplaatst', 'ruiling', 'inval', 'vervanging', 'moved', 'room'];
    const isModification = modKeywords.some(kw => textContent.includes(kw));

    if (app.valid === false && !isModification) {
        return true;
    }

    return false;
}

const DEFAULT_SCHEDULE_SLOTS_EN = [
    { id: 'slot_1', type: 'lesson', label: '1st hour', start: '08:10', end: '09:00' },
    { id: 'slot_2', type: 'lesson', label: '2nd hour', start: '09:00', end: '09:50' },
    { id: 'slot_3', type: 'lesson', label: '3rd hour', start: '09:50', end: '10:40' },
    { id: 'slot_4', type: 'break', label: 'First break', start: '10:40', end: '11:05' },
    { id: 'slot_5', type: 'lesson', label: '4th hour', start: '11:05', end: '11:55' },
    { id: 'slot_6', type: 'lesson', label: '5th hour', start: '11:55', end: '12:45' },
    { id: 'slot_7', type: 'break', label: 'Second break', start: '12:45', end: '13:15' },
    { id: 'slot_8', type: 'lesson', label: '6th hour', start: '13:15', end: '14:05' },
    { id: 'slot_9', type: 'lesson', label: '7th hour', start: '14:05', end: '14:55' },
    { id: 'slot_10', type: 'lesson', label: '8th hour', start: '14:55', end: '15:45' },
    { id: 'slot_11', type: 'lesson', label: '9th hour', start: '15:45', end: '16:35' }
];

const DEFAULT_SCHEDULE_SLOTS_NL = [
    { id: 'slot_1', type: 'lesson', label: '1e uur', start: '08:10', end: '09:00' },
    { id: 'slot_2', type: 'lesson', label: '2e uur', start: '09:00', end: '09:50' },
    { id: 'slot_3', type: 'lesson', label: '3e uur', start: '09:50', end: '10:40' },
    { id: 'slot_4', type: 'break', label: 'Eerste pauze', start: '10:40', end: '11:05' },
    { id: 'slot_5', type: 'lesson', label: '4e uur', start: '11:05', end: '11:55' },
    { id: 'slot_6', type: 'lesson', label: '5e uur', start: '11:55', end: '12:45' },
    { id: 'slot_7', type: 'break', label: 'Tweede pauze', start: '12:45', end: '13:15' },
    { id: 'slot_8', type: 'lesson', label: '6e uur', start: '13:15', end: '14:05' },
    { id: 'slot_9', type: 'lesson', label: '7e uur', start: '14:05', end: '14:55' },
    { id: 'slot_10', type: 'lesson', label: '8e uur', start: '14:55', end: '15:45' },
    { id: 'slot_11', type: 'lesson', label: '9e uur', start: '15:45', end: '16:35' }
];

function getDefaultSlots(lang) {
    return lang === 'nl' ? DEFAULT_SCHEDULE_SLOTS_NL : DEFAULT_SCHEDULE_SLOTS_EN;
}

function translateDefaultSlots(targetLang) {
    const enSlots = DEFAULT_SCHEDULE_SLOTS_EN;
    const nlSlots = DEFAULT_SCHEDULE_SLOTS_NL;
    const targetSlots = targetLang === 'nl' ? DEFAULT_SCHEDULE_SLOTS_NL : DEFAULT_SCHEDULE_SLOTS_EN;

    STATE.settings.scheduleSlots.forEach(slot => {
        if (slot.isCustomLabel) return;

        const enMatch = enSlots.find(s => s.id === slot.id);
        const nlMatch = nlSlots.find(s => s.id === slot.id);
        const targetMatch = targetSlots.find(s => s.id === slot.id);

        const currentLabelLower = (slot.label || '').trim().toLowerCase();
        const matchesEnDefault = enMatch && currentLabelLower === enMatch.label.toLowerCase();
        const matchesNlDefault = nlMatch && currentLabelLower === nlMatch.label.toLowerCase();

        if (targetMatch && (!slot.label || matchesEnDefault || matchesNlDefault)) {
            slot.label = targetMatch.label;
        }
    });
}

function updateAndChainSlots() {
    const slots = STATE.settings.scheduleSlots;
    if (!slots || slots.length === 0) return;

    for (let i = 0; i < slots.length; i++) {
        let startMin = timeToMinutes(slots[i].start);
        let endMin = timeToMinutes(slots[i].end);
        let duration = endMin > startMin ? (endMin - startMin) : 45;

        if (i > 0) {
            slots[i].start = slots[i - 1].end;
            startMin = timeToMinutes(slots[i].start);
        }

        slots[i].end = minutesToTime(startMin + duration);
    }
}

function timeToY(timeMin, minMinutes, hourHeight = 72) {
    const pxPerMin = hourHeight / 60;
    return (timeMin - minMinutes) * pxPerMin;
}

const SUBJECT_DATABASE = {
    'ne': { nl: 'Nederlands', en: 'Dutch' },
    'netl': { nl: 'Nederlands', en: 'Dutch' },
    'nederlands': { nl: 'Nederlands', en: 'Dutch' },
    'en': { nl: 'Engels', en: 'English' },
    'entl': { nl: 'Engels', en: 'English' },
    'engels': { nl: 'Engels', en: 'English' },
    'du': { nl: 'Duits', en: 'German' },
    'dutl': { nl: 'Duits', en: 'German' },
    'de': { nl: 'Duits', en: 'German' },
    'duits': { nl: 'Duits', en: 'German' },
    'fa': { nl: 'Frans', en: 'French' },
    'fatl': { nl: 'Frans', en: 'French' },
    'frans': { nl: 'Frans', en: 'French' },
    'sp': { nl: 'Spaans', en: 'Spanish' },
    'sptl': { nl: 'Spaans', en: 'Spanish' },
    'spaans': { nl: 'Spaans', en: 'Spanish' },
    'la': { nl: 'Latijn', en: 'Latin' },
    'ltc': { nl: 'Latijn', en: 'Latin' },
    'latijn': { nl: 'Latijn', en: 'Latin' },
    'gr': { nl: 'Grieks', en: 'Greek' },
    'gtc': { nl: 'Grieks', en: 'Greek' },
    'grieks': { nl: 'Grieks', en: 'Greek' },
    'wi': { nl: 'Wiskunde', en: 'Math' },
    'wisk': { nl: 'Wiskunde', en: 'Math' },
    'wiskunde': { nl: 'Wiskunde', en: 'Math' },
    'wia': { nl: 'Wiskunde A', en: 'Math A' },
    'wa': { nl: 'Wiskunde A', en: 'Math A' },
    'wib': { nl: 'Wiskunde B', en: 'Math B' },
    'wb': { nl: 'Wiskunde B', en: 'Math B' },
    'wic': { nl: 'Wiskunde C', en: 'Math C' },
    'wc': { nl: 'Wiskunde C', en: 'Math C' },
    'wid': { nl: 'Wiskunde D', en: 'Math D' },
    'wd': { nl: 'Wiskunde D', en: 'Math D' },
    'lo': { nl: 'Lichamelijke Opvoeding', en: 'PE / Gym' },
    'gym': { nl: 'Lichamelijke Opvoeding', en: 'PE / Gym' },
    'pe': { nl: 'Lichamelijke Opvoeding', en: 'PE / Gym' },
    'sk': { nl: 'Scheikunde', en: 'Chemistry' },
    'schei': { nl: 'Scheikunde', en: 'Chemistry' },
    'bi': { nl: 'Biologie', en: 'Biology' },
    'bio': { nl: 'Biologie', en: 'Biology' },
    'na': { nl: 'Natuurkunde', en: 'Physics' },
    'nat': { nl: 'Natuurkunde', en: 'Physics' },
    'ak': { nl: 'Aardrijkskunde', en: 'Geography' },
    'aard': { nl: 'Aardrijkskunde', en: 'Geography' },
    'gs': { nl: 'Geschiedenis', en: 'History' },
    'ges': { nl: 'Geschiedenis', en: 'History' },
    'ec': { nl: 'Economie', en: 'Economics' },
    'econ': { nl: 'Economie', en: 'Economics' },
    'beco': { nl: 'Bedrijfseconomie', en: 'Business Economics' },
    'be': { nl: 'Bedrijfseconomie', en: 'Business Economics' },
    'm&o': { nl: 'Bedrijfseconomie', en: 'Business Economics' },
    'mu': { nl: 'Muziek', en: 'Music' },
    'mus': { nl: 'Muziek', en: 'Music' },
    'ha': { nl: 'Handvaardigheid', en: 'Crafts' },
    'te': { nl: 'Tekenen', en: 'Art' },
    'bv': { nl: 'Beeldende Vorming', en: 'Visual Arts' },
    'ckv': { nl: 'CKV', en: 'Cultural Art' },
    'mvt': { nl: 'Moderne Vreemde Talen', en: 'Foreign Languages' },
    'coach': { nl: 'Coaching', en: 'Coaching' },
    'coaching': { nl: 'Coaching', en: 'Coaching' },
    'men': { nl: 'Mentoraat', en: 'Mentoring' },
    'ment': { nl: 'Mentoraat', en: 'Mentoring' },
    'slb': { nl: 'Mentoraat', en: 'Mentoring' },
    'inf': { nl: 'Informatica', en: 'Computer Science' },
    'ib': { nl: 'Informatica', en: 'Computer Science' },
    'nlt': { nl: 'NLT', en: 'Science & Tech' },
    'anw': { nl: 'ANW', en: 'General Science' },
    'o&o': { nl: 'Onderzoek & Ontwerpen', en: 'Research & Design' },
    'bsm': { nl: 'BSM', en: 'Sports Science' },
    'maw': { nl: 'Maatschappijleer', en: 'Social Studies' },
    'maat': { nl: 'Maatschappijleer', en: 'Social Studies' }
};

function getSubjectNiceName(code, lang) {
    if (!code) return 'Activity';
    const lower = code.toLowerCase().trim();

    if (SUBJECT_DATABASE[lower]) {
        return SUBJECT_DATABASE[lower][lang] || SUBJECT_DATABASE[lower]['en'];
    }

    if (STATE.subjectsMap[lower]) {
        return STATE.subjectsMap[lower];
    }

    return code;
}

const DAY_KEYS = [
    { id: 1, label: 'Mo' },
    { id: 2, label: 'Tu' },
    { id: 3, label: 'We' },
    { id: 4, label: 'Th' },
    { id: 5, label: 'Fr' },
    { id: 6, label: 'Sa' },
    { id: 0, label: 'Su' }
];

const TRANSLATIONS = {
    en: {
        signIn: "Sign In",
        signInDesc: "Enter your school name and the 12-digit linking code from Zermelo.",
        schoolLabel: "School Identifier",
        codeLabel: "12-Digit Linking Code",
        rememberMe: "Remember me on this device",
        weekSchedule: "Schedule Overview",
        connectedTo: "Connected to",
        offlineMode: "Offline Mode (Local)",
        preferences: "Preferences",
        language: "Language",
        timetableRange: "Timetable View Range",
        view7Days: "Next 7 Days (Stacked)",
        view1Week: "1 Week",
        view2Weeks: "2 Weeks",
        view3Weeks: "3 Weeks",
        view4Weeks: "4 Weeks (1 Month)",
        startDay: "Start Schedule From",
        todayOption: "Today",
        mondayOption: "Monday of current week",
        dateFormat: "Date Format",
        timeFormat: "Time Format",
        timeFormat24: "24-hour (14:30)",
        timeFormat12: "12-hour (2:30 PM)",
        schoolHoursPerDayTitle: "School Start & End Times Per Day",
        scheduleSlotsTitle: "School Hours & Breaks",
        addSlotBtn: "+ Add Item",
        slotTypeLesson: "Lesson",
        slotTypeBreak: "Break",
        showWeekends: "Show Weekends",
        showWeekendsDesc: "Display Saturday and Sunday columns",
        showCancelled: "Show Cancelled Classes",
        showCancelledDesc: "Display cancelled appointments",
        signOut: "Sign Out",
        authenticating: "Authenticating...",
        fetching: "Fetching timetable...",
        cancelledTag: "Cancelled",
        subjectLabel: "Full Subject Name:",
        codeLabelModal: "Subject Code:",
        timeLabel: "Time:",
        roomLabel: "Location / Room:",
        teacherLabel: "Teacher(s):",
        groupLabel: "Class / Group:",
        remarkLabel: "Remark:",
        warningLabel: "Warning:",
        weekPrefix: "Week",
        resetDefault: "Reset Default",
        save: "Save",
        addEventBtn: "Add Event",
        addEventTitle: "Add Custom Event",
        editEventTitle: "Edit Custom Event",
        editEventBtn: "Edit Event",
        eventTypeLabel: "Event Type:",
        eventTypeLesson: "Lesson / Activity",
        eventTypeTodo: "To-Do / Task",
        todoTag: "To-Do",
        repeatLabel: "Repeat:",
        repeatNone: "Does not repeat",
        repeatWeekly: "Every week",
        repeatEndLabel: "Ends:",
        repeatForever: "Forever",
        repeatUntil: "Until date",
        repeatUntilDateLabel: "Until Date:",
        eventTitleLabel: "Title / Subject",
        eventTitlePlaceholder: "e.g. Homework Club / Gym Session",
        eventDateLabel: "Date",
        eventStartLabel: "Start Time",
        eventEndLabel: "End Time",
        eventRoomPlaceholder: "e.g. Room 101",
        eventTeacherPlaceholder: "e.g. Mr. Smith",
        deleteEvent: "Delete Custom Event",
        overlapWarningText: "Overlaps with",
        outOfBoundsError: "Event is out of bounds! The school hours for this day are {start} – {end}.",
        invalidTimeError: "Start time must be before end time.",
        noSchoolEventError: "Cannot schedule an event on a 'No School' day.",
        authError: "Authentication Error: Please check your code or school ID.",
        connError: "Error fetching timetable. Check CORS or connection.",
        markNoSchool: "No School",
        noSchoolLabel: "No School / Day Off",
        pdfBtn: "PDF",
        backupTitle: "Backup & Restore",
        exportData: "Export Data",
        importData: "Import Data",
        resetSettings: "Reset Settings",
        resetCustomEvents: "Clear Events",
        confirmResetSettings: "Are you sure you want to reset all preferences to default? Your login and custom events will be kept.",
        confirmResetEvents: "Are you sure you want to delete all custom events? Your settings and login will be kept.",
        boundStart: "Start",
        boundEnd: "End",
        zermeloAccountTitle: "Zermelo Account",
        connectBtn: "Connect Zermelo",
        disconnectBtn: "Disconnect Zermelo",
        disconnectedStatus: "Not connected to Zermelo",
        orbinuityAccountTitle: "Orbinuity Cloud Sync",
        connectOrbinuityBtn: "Login & Connect Orbinuity",
        disconnectOrbinuityBtn: "Disconnect Orbinuity",
        orbinuityNotConnected: "Not connected to Orbinuity account",
        orbinuityConnectedAs: "Synced as",
        orbinuityNoAccountPrompt: "Don't have an account yet?",
        orbinuitySignupLinkText: "Create one at Orbinuity",
        orbUsernameLabel: "Orbinuity Username",
        orbPasswordLabel: "Orbinuity Password",
        orbUsernamePlaceholder: "Username",
        orbPasswordPlaceholder: "Password",
        uploadCloudBtn: "Upload to Cloud",
        downloadCloudBtn: "Download from Cloud",
        syncNowBtn: "Sync Cloud Data",
        syncingText: "Syncing...",
        daysShort: { 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa', 0: 'Su' }
    },
    nl: {
        signIn: "Inloggen",
        signInDesc: "Voer je schoolnaam en de 12-cijferige koppelcode in van Zermelo.",
        schoolLabel: "Schoolnummer / Naam",
        codeLabel: "12-Cijferige Koppelcode",
        rememberMe: "Onthoud mij op dit apparaat",
        weekSchedule: "Rooster Overzicht",
        connectedTo: "Verbonden met",
        offlineMode: "Offlinemodus (Lokaal)",
        preferences: "Preferences",
        language: "Taal",
        timetableRange: "Rooster Weergave Periode",
        view7Days: "Komende 7 Dagen (Gestapeld)",
        view1Week: "1 Week",
        view2Weeks: "2 Weken",
        view3Weeks: "3 Weken",
        view4Weeks: "4 Weken (1 Maand)",
        startDay: "Start Rooster Vanaf",
        todayOption: "Vandaag",
        mondayOption: "Maandag van deze week",
        dateFormat: "Datum Weergave",
        timeFormat: "Tijdindeling",
        timeFormat24: "24-uurs (14:30)",
        timeFormat12: "12-uurs (2:30 PM)",
        schoolHoursPerDayTitle: "Begin- & Eindtijd per Dag",
        scheduleSlotsTitle: "Lesuren & Pauzes",
        addSlotBtn: "+ Item Toevoegen",
        slotTypeLesson: "Lesuur",
        slotTypeBreak: "Pauze",
        showWeekends: "Toon Weekenden",
        showWeekendsDesc: "Toon zaterdag en zondag kolommen",
        showCancelled: "Toon Uitgevallen Lessen",
        showCancelledDesc: "Toon uitgevallen afspraken",
        signOut: "Uitloggen",
        authenticating: "Verifiëren...",
        fetching: "Rooster ophalen...",
        cancelledTag: "Uitgevallen",
        subjectLabel: "Volledige Vaknaam:",
        codeLabelModal: "Vakcode:",
        timeLabel: "Tijd:",
        roomLabel: "Locatie / Lokaal:",
        teacherLabel: "Docent(en):",
        groupLabel: "Klas / Groep:",
        remarkLabel: "Opmerking:",
        warningLabel: "Waarschuwing:",
        weekPrefix: "Week",
        resetDefault: "Standaard Herstellen",
        save: "Opslaan",
        addEventBtn: "Evenement Toevoegen",
        addEventTitle: "Aangepast Evenement Toevoegen",
        editEventTitle: "Aangepast Evenement Bewerken",
        editEventBtn: "Bewerken",
        eventTypeLabel: "Type Evenement:",
        eventTypeLesson: "Les / Activiteit",
        eventTypeTodo: "To-do / Taak",
        todoTag: "To-do",
        repeatLabel: "Herhalen:",
        repeatNone: "Niet herhalen",
        repeatWeekly: "Elke week",
        repeatEndLabel: "Eindigt:",
        repeatForever: "Oneindig",
        repeatUntil: "Tot datum",
        repeatUntilDateLabel: "Tot datum:",
        eventTitleLabel: "Titel / Vak",
        eventDateLabel: "Datum",
        eventStartLabel: "Start Tijd",
        eventEndLabel: "Eind Tijd",
        eventRoomPlaceholder: "bijv. Lokaal 101",
        eventTeacherPlaceholder: "bijv. Dhr. Jansen",
        deleteEvent: "Evenement Verwijderen",
        overlapWarningText: "Overlapt met",
        outOfBoundsError: "Evenement valt buiten de schooltijden! De schooltijden voor deze dag zijn {start} – {end}.",
        invalidTimeError: "Starttijd moet voor de eindtijd liggen.",
        noSchoolEventError: "Kan geen evenement inplannen op een vrije dag.",
        authError: "Authenticatiefout: Controleer de koppelcode en schoolnaam.",
        connError: "Fout bij ophalen rooster. Controleer de verbinding.",
        markNoSchool: "Geen School",
        noSchoolLabel: "Geen School / Vrije Dag",
        pdfBtn: "PDF",
        backupTitle: "Back-up & Herstel",
        exportData: "Exporteer Gegevens",
        importData: "Importeer Gegevens",
        resetSettings: "Instellingen Resetten",
        resetCustomEvents: "Eigen Events Wissen",
        confirmResetSettings: "Weet je zeker dat je alle instellingen wilt herstellen naar de standaardwaarden? Je inloggegevens en eigen events blijven bewaard.",
        confirmResetEvents: "Weet je zeker dat je alle eigen events wilt verwijderen? Je instellingen en inloggegevens blijven bewaard.",
        boundStart: "Start",
        boundEnd: "Einde",
        zermeloAccountTitle: "Zermelo-account",
        connectBtn: "Verbinden met Zermelo",
        disconnectBtn: "Ontkoppelen van Zermelo",
        disconnectedStatus: "Niet verbonden met Zermelo",
        orbinuityAccountTitle: "Orbinuity Cloud-sync",
        connectOrbinuityBtn: "Inloggen & Verbinden met Orbinuity",
        disconnectOrbinuityBtn: "Ontkoppelen van Orbinuity",
        orbinuityNotConnected: "Niet verbonden met een Orbinuity-account",
        orbinuityConnectedAs: "Gesynchroniseerd als",
        orbinuityNoAccountPrompt: "Nog geen account?",
        orbinuitySignupLinkText: "Maak er een aan op Orbinuity",
        orbUsernameLabel: "Orbinuity Gebruikersnaam",
        orbPasswordLabel: "Orbinuity Wachtwoord",
        orbUsernamePlaceholder: "Gebruikersnaam",
        orbPasswordPlaceholder: "Wachtwoord",
        uploadCloudBtn: "Uploaden naar Cloud",
        downloadCloudBtn: "Downloaden uit Cloud",
        syncNowBtn: "Cloudgegevens Synchroniseren",
        syncingText: "Synchroniseren...",
        daysShort: { 1: 'Ma', 2: 'Di', 3: 'Wo', 4: 'Do', 5: 'Vr', 6: 'Za', 0: 'Zo' }
    }
};

const STATE = {
    auth: {
        school: '',
        user: '~me',
        token: ''
    },
    orbinuityUser: null,
    orbinuityToken: null,
    editingCustomEventId: null,
    settings: {
        rangeView: '7days',
        showWeekends: false,
        showCancelled: true,
        language: 'en',
        timeFormat: '24h',
        dateFormat: 'D MMM YYYY',
        startDay: 'monday',
        schoolHoursPerDay: {
            1: { start: '08:00', end: '17:00' },
            2: { start: '08:00', end: '17:00' },
            3: { start: '08:00', end: '17:00' },
            4: { start: '08:00', end: '17:00' },
            5: { start: '08:00', end: '17:00' },
            6: { start: '08:00', end: '17:00' },
            0: { start: '08:00', end: '17:00' }
        },
        scheduleSlots: JSON.parse(JSON.stringify(DEFAULT_SCHEDULE_SLOTS_EN)),
        dayOverrides: {}
    },
    customEvents: [],
    subjectsMap: {},
    activeDayOverrideKey: null,
    activeOpenedApp: null,
    draggedSlotIndex: null
};

const API_ORBINUITY_BASE = 'https://api.orbinuity.nl:34430/api';

const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');

const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');

const addEventBtn = document.getElementById('addEventBtn');
const customEventModal = document.getElementById('customEventModal');
const customEventModalTitle = document.getElementById('customEventModalTitle');
const closeCustomEventBtn = document.getElementById('closeCustomEventBtn');
const customEventForm = document.getElementById('customEventForm');

const eventRepeatSelect = document.getElementById('eventRepeatSelect');
const repeatOptionsGroup = document.getElementById('repeatOptionsGroup');
const eventRepeatEndSelect = document.getElementById('eventRepeatEndSelect');
const repeatUntilGroup = document.getElementById('repeatUntilGroup');
const eventRepeatUntilInput = document.getElementById('eventRepeatUntilInput');

const lessonModal = document.getElementById('lessonModal');
const closeLessonBtn = document.getElementById('closeLessonBtn');
const deleteCustomEventFooter = document.getElementById('deleteCustomEventFooter');
const deleteCustomEventBtn = document.getElementById('deleteCustomEventBtn');
const editCustomEventBtn = document.getElementById('editCustomEventBtn');
const overlapWarningRow = document.getElementById('overlapWarningRow');
const lessonModalOverlapText = document.getElementById('lessonModalOverlapText');

const dayHoursModal = document.getElementById('dayHoursModal');
const closeDayHoursBtn = document.getElementById('closeDayHoursBtn');
const saveDayHoursBtn = document.getElementById('saveDayHoursBtn');
const resetDayHoursBtn = document.getElementById('resetDayHoursBtn');
const markNoSchoolBtn = document.getElementById('markNoSchoolBtn');
const dayStartInput = document.getElementById('dayStartInput');
const dayEndInput = document.getElementById('dayEndInput');
const dayHoursTitle = document.getElementById('dayHoursTitle');

const settingLanguage = document.getElementById('settingLanguage');
const settingRange = document.getElementById('settingRange');
const settingStartDay = document.getElementById('settingStartDay');
const settingDateFormat = document.getElementById('settingDateFormat');
const settingTimeFormat = document.getElementById('settingTimeFormat');
const settingShowWeekends = document.getElementById('settingShowWeekends');
const settingShowCancelled = document.getElementById('settingShowCancelled');
const addSlotBtn = document.getElementById('addSlotBtn');

const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const resetSettingsBtn = document.getElementById('resetSettingsBtn');
const resetCustomEventsBtn = document.getElementById('resetCustomEventsBtn');
const importFileInput = document.getElementById('importFileInput');

const userContext = document.getElementById('userContext');
const scheduleContainer = document.getElementById('schedule');

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    loadStoredData();
    applyLanguage();
    await checkOrbinuityDirectApi();
    renderOrbinuitySettings();
    renderZermeloSettings();
    renderSchoolHoursPerDaySettings();
    renderScheduleSlotsManager();
    setupEventListeners();
});

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute('data-theme', 'dark');
    }
}

function loadStoredData() {
    const storedSettings = localStorage.getItem('zermelo_settings');
    if (storedSettings) {
        STATE.settings = { ...STATE.settings, ...JSON.parse(storedSettings) };
    }

    if (!STATE.settings.scheduleSlots || STATE.settings.scheduleSlots.length === 0) {
        STATE.settings.scheduleSlots = JSON.parse(JSON.stringify(getDefaultSlots(STATE.settings.language)));
    } else {
        updateAndChainSlots();
    }

    const storedEvents = localStorage.getItem('zermelo_custom_events');
    if (storedEvents) {
        STATE.customEvents = JSON.parse(storedEvents);
    }

    const storedToken = localStorage.getItem('orbinuity_token');
    if (storedToken) {
        STATE.orbinuityToken = storedToken;
    }

    const storedOrbinuityUser = localStorage.getItem('orbinuity_user_cache');
    if (storedOrbinuityUser) {
        try {
            STATE.orbinuityUser = JSON.parse(storedOrbinuityUser);
        } catch (e) {
            STATE.orbinuityUser = null;
        }
    }

    if (settingLanguage) settingLanguage.value = STATE.settings.language;
    if (settingRange) settingRange.value = STATE.settings.rangeView;
    if (settingStartDay) settingStartDay.value = STATE.settings.startDay;
    if (settingDateFormat) settingDateFormat.value = STATE.settings.dateFormat || 'D MMM YYYY';
    if (settingTimeFormat) settingTimeFormat.value = STATE.settings.timeFormat;
    if (settingShowWeekends) settingShowWeekends.checked = STATE.settings.showWeekends;
    if (settingShowCancelled) settingShowCancelled.checked = STATE.settings.showCancelled;

    const storedAuth = localStorage.getItem('zermelo_auth');
    if (storedAuth) {
        STATE.auth = JSON.parse(storedAuth);
    }

    showDashboard();
}

function applyLanguage() {
    const lang = STATE.settings.language;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    if (userContext) {
        const zermeloConnected = !!(STATE.auth.school && STATE.auth.token);
        const orbConnected = !!(STATE.orbinuityUser && STATE.orbinuityToken);
        const orbName = STATE.orbinuityUser?.displayName || STATE.orbinuityUser?.username;

        if (zermeloConnected && orbConnected) {
            userContext.textContent = `${t.connectedTo} ${STATE.auth.school} | ${orbName}`;
        } else if (zermeloConnected) {
            userContext.textContent = `${t.connectedTo} ${STATE.auth.school}`;
        } else if (orbConnected) {
            userContext.textContent = `${orbName} (${t.offlineMode || 'Offline Mode'})`;
        } else {
            userContext.textContent = t.offlineMode || 'Offline Mode';
        }
    }
}

async function checkOrbinuityDirectApi() {
    if (!STATE.orbinuityToken) return;
    try {
        const res = await fetch(`${API_ORBINUITY_BASE}/account/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${STATE.orbinuityToken}`
            }
        });
        if (res.ok) {
            const data = await res.json();
            STATE.orbinuityUser = data;
            localStorage.setItem('orbinuity_user_cache', JSON.stringify(data));
        } else {
            STATE.orbinuityUser = null;
            STATE.orbinuityToken = null;
            localStorage.removeItem('orbinuity_token');
            localStorage.removeItem('orbinuity_user_cache');
        }
    } catch (e) {
        console.warn(e);
    }
}

async function directOrbinuityLogin(username, password) {
    const res = await fetch(`${API_ORBINUITY_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Login failed');
    }

    STATE.orbinuityToken = data.token;
    localStorage.setItem('orbinuity_token', data.token);

    await checkOrbinuityDirectApi();
    applyLanguage();
}

async function syncToOrbinuityCloud() {
    if (!STATE.orbinuityToken) return;
    const statusMsg = document.getElementById('orbinuityStatusMsg');

    try {
        if (statusMsg) statusMsg.textContent = 'Uploading to cloud...';

        const payload = {
            settings: STATE.settings,
            customEvents: STATE.customEvents,
            auth: STATE.auth,
            lastSynced: Date.now()
        };

        const res = await fetch(`${API_ORBINUITY_BASE}/external/sandePlanner`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STATE.orbinuityToken}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            if (statusMsg) {
                const timeStr = new Date().toLocaleTimeString();
                statusMsg.textContent = `Uploaded to cloud at ${timeStr}`;
                statusMsg.style.color = 'var(--text-muted)';
            }
        } else {
            const errData = await res.json().catch(() => ({}));
            if (statusMsg) {
                statusMsg.textContent = errData.error || 'Cloud upload failed';
                statusMsg.style.color = 'var(--danger)';
            }
        }
    } catch (e) {
        if (statusMsg) {
            statusMsg.textContent = 'Cloud sync error';
            statusMsg.style.color = 'var(--danger)';
        }
    }
}

async function loadFromOrbinuityCloud() {
    if (!STATE.orbinuityToken) return;
    const statusMsg = document.getElementById('orbinuityStatusMsg');

    try {
        if (statusMsg) statusMsg.textContent = 'Downloading cloud data...';

        const res = await fetch(`${API_ORBINUITY_BASE}/external/sandePlanner`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${STATE.orbinuityToken}`
            }
        });

        if (res.ok) {
            let rawData = await res.json();
            if (typeof rawData === 'string') {
                try { rawData = JSON.parse(rawData); } catch (e) {}
            }

            const data = rawData.data || rawData.value || rawData.payload || rawData;
            const plannerSettings = data.settings || data.sandePlannerSettings;
            const plannerEvents = data.customEvents || data.sandePlannerEvents;
            const plannerAuth = data.auth || data.sandePlannerAuth;

            if (plannerSettings) STATE.settings = { ...STATE.settings, ...plannerSettings };
            if (Array.isArray(plannerEvents)) STATE.customEvents = plannerEvents;
            if (plannerAuth) {
                STATE.auth = plannerAuth;
                localStorage.setItem('zermelo_auth', JSON.stringify(STATE.auth));
            }

            updateAndChainSlots();
            saveSettings(false);
            saveCustomEvents(false);

            renderZermeloSettings();
            renderSchoolHoursPerDaySettings();
            renderScheduleSlotsManager();
            applyLanguage();
            fetchSubjectDefinitions();
            fetchSchedule();

            if (statusMsg) {
                const timeStr = new Date().toLocaleTimeString();
                statusMsg.textContent = `Downloaded cloud data at ${timeStr}`;
                statusMsg.style.color = 'var(--text-muted)';
            }
        } else {
            if (statusMsg) {
                statusMsg.textContent = 'Failed to download cloud data';
                statusMsg.style.color = 'var(--danger)';
            }
        }
    } catch (e) {
        if (statusMsg) {
            statusMsg.textContent = 'Failed to download cloud data';
            statusMsg.style.color = 'var(--danger)';
        }
    }
}

function renderOrbinuitySettings() {
    const container = document.getElementById('orbinuitySettingsContainer');
    if (!container) return;

    const lang = STATE.settings.language;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const isConnected = !!(STATE.orbinuityToken && STATE.orbinuityUser);

    if (isConnected) {
        const displayName = STATE.orbinuityUser.displayName || STATE.orbinuityUser.username || 'User';
        container.innerHTML = `
            <div class="orbinuity-card">
                <div class="orbinuity-status-row">
                    <span class="orbinuity-status-text">${t.orbinuityConnectedAs} <strong>${displayName}</strong></span>
                    <button id="disconnectOrbinuityBtn" class="btn-danger" style="font-size:0.78rem; padding: 0.35rem 0.75rem;">${t.disconnectOrbinuityBtn}</button>
                </div>
                <p id="orbinuityStatusMsg" style="font-size:0.78rem; color:var(--text-muted); margin-top:0.2rem;"></p>
                <div style="display:flex; gap:0.4rem; margin-top:0.4rem;">
                    <button id="uploadOrbinuityBtn" class="btn-secondary" style="font-size:0.8rem; padding:0.45rem; flex:1;">${t.uploadCloudBtn || 'Upload to Cloud'}</button>
                    <button id="downloadOrbinuityBtn" class="btn-secondary" style="font-size:0.8rem; padding:0.45rem; flex:1;">${t.downloadCloudBtn || 'Download from Cloud'}</button>
                </div>
            </div>
        `;

        document.getElementById('disconnectOrbinuityBtn').addEventListener('click', () => {
            STATE.orbinuityUser = null;
            STATE.orbinuityToken = null;
            localStorage.removeItem('orbinuity_token');
            localStorage.removeItem('orbinuity_user_cache');
            renderOrbinuitySettings();
            applyLanguage();
        });

        document.getElementById('uploadOrbinuityBtn').addEventListener('click', async () => {
            const btn = document.getElementById('uploadOrbinuityBtn');
            btn.disabled = true;
            await syncToOrbinuityCloud();
            btn.disabled = false;
        });

        document.getElementById('downloadOrbinuityBtn').addEventListener('click', async () => {
            const btn = document.getElementById('downloadOrbinuityBtn');
            btn.disabled = true;
            await loadFromOrbinuityCloud();
            btn.disabled = false;
        });
    } else {
        container.innerHTML = `
            <div class="orbinuity-card">
                <p id="orbinuityStatusMsg" style="font-size:0.8rem; color:var(--text-muted);">${t.orbinuityNotConnected}</p>
                <div class="form-group" style="margin-bottom:0.4rem;">
                    <label for="orbDirectUser" data-i18n="orbUsernameLabel">${t.orbUsernameLabel}</label>
                    <input type="text" id="orbDirectUser" placeholder="${t.orbUsernamePlaceholder}" style="font-size:0.82rem; padding:0.45rem 0.6rem;">
                </div>
                <div class="form-group" style="margin-bottom:0.5rem;">
                    <label for="orbDirectPass" data-i18n="orbPasswordLabel">${t.orbPasswordLabel}</label>
                    <input type="password" id="orbDirectPass" placeholder="${t.orbPasswordPlaceholder}" style="font-size:0.82rem; padding:0.45rem 0.6rem;">
                </div>
                <button id="orbDirectLoginBtn" class="btn-primary" style="font-size:0.85rem; padding:0.5rem;">${t.signIn}</button>
                <p class="orbinuity-signup-prompt">
                    <span data-i18n="orbinuityNoAccountPrompt">${t.orbinuityNoAccountPrompt}</span>
                    <a href="https://orbinuity.nl/account/signup" target="_blank" rel="noopener" data-i18n="orbinuitySignupLinkText">${t.orbinuitySignupLinkText}</a>
                </p>
            </div>
        `;

        document.getElementById('orbDirectLoginBtn').addEventListener('click', async () => {
            const btn = document.getElementById('orbDirectLoginBtn');
            const statusMsg = document.getElementById('orbinuityStatusMsg');
            const u = document.getElementById('orbDirectUser').value.trim();
            const p = document.getElementById('orbDirectPass').value;

            if (!u || !p) return;

            btn.disabled = true;
            btn.textContent = t.authenticating;

            try {
                await directOrbinuityLogin(u, p);
                renderOrbinuitySettings();
            } catch (err) {
                if (statusMsg) {
                    statusMsg.textContent = err.message;
                    statusMsg.style.color = 'var(--danger)';
                }
            } finally {
                btn.disabled = false;
                btn.textContent = t.signIn;
            }
        });
    }
}

function renderZermeloSettings() {
    const container = document.getElementById('zermeloSettingsContainer');
    if (!container) return;

    const lang = STATE.settings.language;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
    const isConnected = !!(STATE.auth.school && STATE.auth.token);

    if (isConnected) {
        container.innerHTML = `
            <div class="zermelo-card">
                <div class="zermelo-status-row">
                    <span class="zermelo-status-text">${t.connectedTo} <strong>${STATE.auth.school}</strong></span>
                    <button id="disconnectZermeloBtn" class="btn-danger" style="font-size:0.78rem; padding: 0.35rem 0.75rem;">${t.disconnectBtn || 'Disconnect'}</button>
                </div>
            </div>
        `;

        document.getElementById('disconnectZermeloBtn').addEventListener('click', () => {
            STATE.auth = { school: '', user: '~me', token: '' };
            STATE.subjectsMap = {};
            localStorage.removeItem('zermelo_auth');
            applyLanguage();
            renderZermeloSettings();
            fetchSchedule();
        });
    } else {
        container.innerHTML = `
            <div class="zermelo-card">
                <p style="font-size:0.8rem; color:var(--text-muted);">${t.disconnectedStatus}</p>
                <div class="form-group" style="margin-bottom:0.5rem;">
                    <label for="zermeloSchoolInput" data-i18n="schoolLabel">${t.schoolLabel}</label>
                    <input type="text" id="zermeloSchoolInput" placeholder="School Identifier (e.g. liemerscollege)" style="font-size:0.85rem; padding:0.5rem 0.75rem;">
                </div>
                <div class="form-group" style="margin-bottom:0.5rem;">
                    <label for="zermeloCodeInput" data-i18n="codeLabel">${t.codeLabel}</label>
                    <input type="text" id="zermeloCodeInput" placeholder="12-Digit Linking Code" maxlength="14" style="font-size:0.85rem; padding:0.5rem 0.75rem;">
                </div>
                <button id="connectZermeloBtn" class="btn-primary" style="font-size:0.85rem; padding:0.5rem;">${t.connectBtn || 'Connect Zermelo'}</button>
            </div>
        `;

        document.getElementById('connectZermeloBtn').addEventListener('click', async () => {
            const school = document.getElementById('zermeloSchoolInput').value.trim();
            const rawCode = document.getElementById('zermeloCodeInput').value.replace(/\s+/g, '');

            if (!school || !rawCode) {
                return;
            }

            const connectBtn = document.getElementById('connectZermeloBtn');
            connectBtn.disabled = true;
            connectBtn.textContent = t.authenticating;

            try {
                const token = await exchangeCodeForToken(school, rawCode);
                STATE.auth = { school, user: '~me', token };
                localStorage.setItem('zermelo_auth', JSON.stringify(STATE.auth));

                applyLanguage();
                renderZermeloSettings();
                fetchSubjectDefinitions();
                fetchSchedule();
            } catch (err) {
                console.warn(err);
            } finally {
                connectBtn.disabled = false;
                connectBtn.textContent = t.connectBtn || 'Connect Zermelo';
            }
        });
    }
}

function setupEventListeners() {
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    if (eventRepeatSelect) {
        eventRepeatSelect.addEventListener('change', (e) => {
            if (e.target.value === 'weekly') {
                if (repeatOptionsGroup) repeatOptionsGroup.classList.remove('hidden');
            } else {
                if (repeatOptionsGroup) repeatOptionsGroup.classList.add('hidden');
            }
        });
    }

    if (eventRepeatEndSelect) {
        eventRepeatEndSelect.addEventListener('change', (e) => {
            if (e.target.value === 'until') {
                if (repeatUntilGroup) repeatUntilGroup.classList.remove('hidden');
            } else {
                if (repeatUntilGroup) repeatUntilGroup.classList.add('hidden');
            }
        });
    }

    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const dataPayload = {
                settings: STATE.settings,
                customEvents: STATE.customEvents,
                auth: STATE.auth,
                orbinuityToken: STATE.orbinuityToken,
                orbinuityUser: STATE.orbinuityUser
            };
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataPayload, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "sande_planner_backup.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    if (importDataBtn && importFileInput) {
        importDataBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const imported = JSON.parse(evt.target.result);
                    if (imported.settings) STATE.settings = { ...STATE.settings, ...imported.settings };
                    if (imported.customEvents) STATE.customEvents = imported.customEvents;
                    if (imported.auth) {
                        STATE.auth = imported.auth;
                        localStorage.setItem('zermelo_auth', JSON.stringify(STATE.auth));
                    }
                    if (imported.orbinuityToken) {
                        STATE.orbinuityToken = imported.orbinuityToken;
                        localStorage.setItem('orbinuity_token', imported.orbinuityToken);
                    }
                    if (imported.orbinuityUser) {
                        STATE.orbinuityUser = imported.orbinuityUser;
                        localStorage.setItem('orbinuity_user_cache', JSON.stringify(imported.orbinuityUser));
                    }

                    updateAndChainSlots();
                    saveSettings(false);
                    saveCustomEvents(false);

                    location.reload();
                } catch (err) {
                    console.warn('Invalid JSON import file.');
                }
            };
            reader.readAsText(file);
        });
    }

    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            const lang = STATE.settings.language;
            const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

            if (confirm(t.confirmResetSettings)) {
                STATE.settings = {
                    rangeView: '7days',
                    showWeekends: false,
                    showCancelled: true,
                    language: lang,
                    timeFormat: '24h',
                    dateFormat: 'D MMM YYYY',
                    startDay: 'monday',
                    schoolHoursPerDay: {
                        1: { start: '08:00', end: '17:00' },
                        2: { start: '08:00', end: '17:00' },
                        3: { start: '08:00', end: '17:00' },
                        4: { start: '08:00', end: '17:00' },
                        5: { start: '08:00', end: '17:00' },
                        6: { start: '08:00', end: '17:00' },
                        0: { start: '08:00', end: '17:00' }
                    },
                    scheduleSlots: JSON.parse(JSON.stringify(getDefaultSlots(lang))),
                    dayOverrides: {}
                };

                saveSettings();

                if (settingLanguage) settingLanguage.value = STATE.settings.language;
                if (settingRange) settingRange.value = STATE.settings.rangeView;
                if (settingStartDay) settingStartDay.value = STATE.settings.startDay;
                if (settingDateFormat) settingDateFormat.value = STATE.settings.dateFormat;
                if (settingTimeFormat) settingTimeFormat.value = STATE.settings.timeFormat;
                if (settingShowWeekends) settingShowWeekends.checked = STATE.settings.showWeekends;
                if (settingShowCancelled) settingShowCancelled.checked = STATE.settings.showCancelled;

                renderSchoolHoursPerDaySettings();
                renderScheduleSlotsManager();
                fetchSchedule();
            }
        });
    }

    if (resetCustomEventsBtn) {
        resetCustomEventsBtn.addEventListener('click', () => {
            const lang = STATE.settings.language;
            const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

            if (confirm(t.confirmResetEvents)) {
                STATE.customEvents = [];
                saveCustomEvents();
                fetchSchedule();
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('zermelo_auth');
            STATE.auth = { school: '', user: '~me', token: '' };
            STATE.subjectsMap = {};
            closeModal();
            applyLanguage();
            renderZermeloSettings();
            fetchSchedule();
        });
    }

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeModal);
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeModal();
        });
    }

    if (addEventBtn && customEventModal) {
        addEventBtn.addEventListener('click', () => {
            STATE.editingCustomEventId = null;
            if (customEventForm) customEventForm.reset();
            if (repeatOptionsGroup) repeatOptionsGroup.classList.add('hidden');
            if (repeatUntilGroup) repeatUntilGroup.classList.add('hidden');

            const t = TRANSLATIONS[STATE.settings.language] || TRANSLATIONS.en;
            if (customEventModalTitle) customEventModalTitle.textContent = t.addEventTitle;
            document.getElementById('eventDateInput').value = getLocalDateKey(new Date());
            customEventModal.classList.remove('hidden');
        });

        if (closeCustomEventBtn) closeCustomEventBtn.addEventListener('click', () => customEventModal.classList.add('hidden'));
        customEventModal.addEventListener('click', (e) => {
            if (e.target === customEventModal) customEventModal.classList.add('hidden');
        });
    }

    if (customEventForm) {
        customEventForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const eventType = document.getElementById('eventTypeInput').value;
            const title = document.getElementById('eventTitleInput').value.trim();
            const dateStr = document.getElementById('eventDateInput').value;
            const startTimeStr = document.getElementById('eventStartInput').value;
            const endTimeStr = document.getElementById('eventEndInput').value;
            const room = document.getElementById('eventRoomInput').value.trim();
            const teacher = document.getElementById('eventTeacherInput').value.trim();

            const repeatMode = document.getElementById('eventRepeatSelect').value;
            const repeatEndMode = document.getElementById('eventRepeatEndSelect').value;
            const repeatUntilVal = document.getElementById('eventRepeatUntilInput').value;

            const startMin = timeToMinutes(startTimeStr);
            const endMin = timeToMinutes(endTimeStr);

            if (startMin >= endMin) {
                return;
            }

            const dateObj = new Date(`${dateStr}T00:00:00`);
            const dayOfWeek = dateObj.getDay();
            const dayConfig = STATE.settings.dayOverrides[dateStr] || STATE.settings.schoolHoursPerDay[dayOfWeek] || { start: '08:00', end: '17:00' };
            const isNoSchool = !!(STATE.settings.dayOverrides[dateStr]?.isNoSchool);

            if (isNoSchool) {
                return;
            }

            const dayStartMin = timeToMinutes(dayConfig.start || '08:00');
            const dayEndMin = timeToMinutes(dayConfig.end || '17:00');

            if (startMin < dayStartMin || endMin > dayEndMin) {
                return;
            }

            const startDate = new Date(`${dateStr}T${startTimeStr}:00`);
            const endDate = new Date(`${dateStr}T${endTimeStr}:00`);

            if (STATE.editingCustomEventId) {
                const eventIndex = STATE.customEvents.findIndex(ev => ev.id === STATE.editingCustomEventId);
                if (eventIndex !== -1) {
                    STATE.customEvents[eventIndex] = {
                        ...STATE.customEvents[eventIndex],
                        isTodo: eventType === 'todo',
                        eventType: eventType,
                        subjects: [title],
                        start: Math.floor(startDate.getTime() / 1000),
                        end: Math.floor(endDate.getTime() / 1000),
                        locations: room ? [room] : ['N/A'],
                        teachers: teacher ? [teacher] : ['Custom'],
                        repeat: repeatMode,
                        repeatEnd: repeatEndMode,
                        repeatUntil: repeatMode === 'weekly' && repeatEndMode === 'until' ? repeatUntilVal : null
                    };
                }
                STATE.editingCustomEventId = null;
            } else {
                const newEvent = {
                    id: 'custom_' + Date.now(),
                    isCustom: true,
                    isTodo: eventType === 'todo',
                    eventType: eventType,
                    subjects: [title],
                    start: Math.floor(startDate.getTime() / 1000),
                    end: Math.floor(endDate.getTime() / 1000),
                    locations: room ? [room] : ['N/A'],
                    teachers: teacher ? [teacher] : ['Custom'],
                    repeat: repeatMode,
                    repeatEnd: repeatEndMode,
                    repeatUntil: repeatMode === 'weekly' && repeatEndMode === 'until' ? repeatUntilVal : null
                };
                STATE.customEvents.push(newEvent);
            }

            saveCustomEvents();
            customEventModal.classList.add('hidden');
            customEventForm.reset();
            fetchSchedule();
        });
    }

    if (editCustomEventBtn) {
        editCustomEventBtn.addEventListener('click', () => {
            const app = STATE.activeOpenedApp;
            if (app && app.isCustom) {
                const masterId = app.parentEventId || app.id;
                const masterEvent = STATE.customEvents.find(ev => ev.id === masterId) || app;

                STATE.editingCustomEventId = masterEvent.id;
                const t = TRANSLATIONS[STATE.settings.language] || TRANSLATIONS.en;

                if (lessonModal) lessonModal.classList.add('hidden');
                if (customEventModalTitle) customEventModalTitle.textContent = t.editEventTitle;

                const appStart = new Date(masterEvent.start * 1000);
                const appEnd = new Date(masterEvent.end * 1000);

                const startH = String(appStart.getHours()).padStart(2, '0');
                const startM = String(appStart.getMinutes()).padStart(2, '0');
                const endH = String(appEnd.getHours()).padStart(2, '0');
                const endM = String(appEnd.getMinutes()).padStart(2, '0');

                document.getElementById('eventTypeInput').value = masterEvent.isTodo ? 'todo' : 'lesson';
                document.getElementById('eventTitleInput').value = masterEvent.subjects?.[0] || '';
                document.getElementById('eventDateInput').value = getLocalDateKey(appStart);
                document.getElementById('eventStartInput').value = `${startH}:${startM}`;
                document.getElementById('eventEndInput').value = `${endH}:${endM}`;
                document.getElementById('eventRoomInput').value = masterEvent.locations?.[0] === 'N/A' ? '' : (masterEvent.locations?.[0] || '');
                document.getElementById('eventTeacherInput').value = (masterEvent.teachers?.[0] === 'Custom' || masterEvent.teachers?.[0] === 'N/A') ? '' : (masterEvent.teachers?.[0] || '');

                const repeatMode = masterEvent.repeat || 'none';
                const repeatEndMode = masterEvent.repeatEnd || 'forever';

                if (eventRepeatSelect) eventRepeatSelect.value = repeatMode;
                if (eventRepeatEndSelect) eventRepeatEndSelect.value = repeatEndMode;
                if (eventRepeatUntilInput) eventRepeatUntilInput.value = masterEvent.repeatUntil || '';

                if (repeatMode === 'weekly') {
                    if (repeatOptionsGroup) repeatOptionsGroup.classList.remove('hidden');
                    if (repeatEndMode === 'until') {
                        if (repeatUntilGroup) repeatUntilGroup.classList.remove('hidden');
                    } else {
                        if (repeatUntilGroup) repeatUntilGroup.classList.add('hidden');
                    }
                } else {
                    if (repeatOptionsGroup) repeatOptionsGroup.classList.add('hidden');
                    if (repeatUntilGroup) repeatUntilGroup.classList.add('hidden');
                }

                if (customEventModal) customEventModal.classList.remove('hidden');
            }
        });
    }

    if (deleteCustomEventBtn) {
        deleteCustomEventBtn.addEventListener('click', () => {
            const app = STATE.activeOpenedApp;
            if (app && app.isCustom) {
                const masterId = app.parentEventId || app.id;
                STATE.customEvents = STATE.customEvents.filter(ev => ev.id !== masterId);
                saveCustomEvents();
                if (lessonModal) lessonModal.classList.add('hidden');
                fetchSchedule();
            }
        });
    }

    if (closeLessonBtn && lessonModal) {
        closeLessonBtn.addEventListener('click', () => lessonModal.classList.add('hidden'));
        lessonModal.addEventListener('click', (e) => {
            if (e.target === lessonModal) lessonModal.classList.add('hidden');
        });
    }

    if (closeDayHoursBtn && dayHoursModal) {
        closeDayHoursBtn.addEventListener('click', () => dayHoursModal.classList.add('hidden'));
        dayHoursModal.addEventListener('click', (e) => {
            if (e.target === dayHoursModal) dayHoursModal.classList.add('hidden');
        });
    }

    if (saveDayHoursBtn) {
        saveDayHoursBtn.addEventListener('click', () => {
            if (STATE.activeDayOverrideKey) {
                if (!STATE.settings.dayOverrides[STATE.activeDayOverrideKey]) {
                    STATE.settings.dayOverrides[STATE.activeDayOverrideKey] = {};
                }
                STATE.settings.dayOverrides[STATE.activeDayOverrideKey].start = dayStartInput.value;
                STATE.settings.dayOverrides[STATE.activeDayOverrideKey].end = dayEndInput.value;
                STATE.settings.dayOverrides[STATE.activeDayOverrideKey].isNoSchool = false;
                saveSettings();
                dayHoursModal.classList.add('hidden');
                fetchSchedule();
            }
        });
    }

    if (resetDayHoursBtn) {
        resetDayHoursBtn.addEventListener('click', () => {
            if (STATE.activeDayOverrideKey) {
                delete STATE.settings.dayOverrides[STATE.activeDayOverrideKey];
                saveSettings();
                dayHoursModal.classList.add('hidden');
                fetchSchedule();
            }
        });
    }

    if (markNoSchoolBtn) {
        markNoSchoolBtn.addEventListener('click', () => {
            if (STATE.activeDayOverrideKey) {
                const dateObj = new Date(STATE.activeDayOverrideKey);
                const dayOfWeek = dateObj.getDay();
                const dayDefault = STATE.settings.schoolHoursPerDay[dayOfWeek] || { start: '08:00', end: '17:00' };

                if (!STATE.settings.dayOverrides[STATE.activeDayOverrideKey]) {
                    STATE.settings.dayOverrides[STATE.activeDayOverrideKey] = { ...dayDefault };
                }

                const overrideObj = STATE.settings.dayOverrides[STATE.activeDayOverrideKey];
                if (!overrideObj.start) overrideObj.start = dayDefault.start;
                if (!overrideObj.end) overrideObj.end = dayDefault.end;

                overrideObj.isNoSchool = !overrideObj.isNoSchool;
                saveSettings();
                dayHoursModal.classList.add('hidden');
                fetchSchedule();
            }
        });
    }

    if (settingLanguage) {
        settingLanguage.addEventListener('change', (e) => {
            const newLang = e.target.value;
            translateDefaultSlots(newLang);
            STATE.settings.language = newLang;
            saveSettings();
            applyLanguage();
            renderOrbinuitySettings();
            renderZermeloSettings();
            renderSchoolHoursPerDaySettings();
            renderScheduleSlotsManager();
            fetchSchedule();
        });
    }

    if (settingRange) {
        settingRange.addEventListener('change', (e) => {
            STATE.settings.rangeView = e.target.value;
            saveSettings();
            fetchSchedule();
        });
    }

    if (settingStartDay) {
        settingStartDay.addEventListener('change', (e) => {
            STATE.settings.startDay = e.target.value;
            saveSettings();
            fetchSchedule();
        });
    }

    if (settingDateFormat) {
        settingDateFormat.addEventListener('change', (e) => {
            STATE.settings.dateFormat = e.target.value;
            saveSettings();
            fetchSchedule();
        });
    }

    if (settingTimeFormat) {
        settingTimeFormat.addEventListener('change', (e) => {
            STATE.settings.timeFormat = e.target.value;
            saveSettings();
            renderSchoolHoursPerDaySettings();
            renderScheduleSlotsManager();
            fetchSchedule();
        });
    }

    if (settingShowWeekends) {
        settingShowWeekends.addEventListener('change', (e) => {
            STATE.settings.showWeekends = e.target.checked;
            saveSettings();
            fetchSchedule();
        });
    }

    if (settingShowCancelled) {
        settingShowCancelled.addEventListener('change', (e) => {
            STATE.settings.showCancelled = e.target.checked;
            saveSettings();
            fetchSchedule();
        });
    }

    if (addSlotBtn) {
        addSlotBtn.addEventListener('click', () => {
            const lastSlot = STATE.settings.scheduleSlots[STATE.settings.scheduleSlots.length - 1];
            const newStart = lastSlot ? lastSlot.end : '08:10';

            STATE.settings.scheduleSlots.push({
                id: 'slot_' + Date.now(),
                type: 'lesson',
                label: `New Item`,
                start: newStart,
                end: minutesToTime(timeToMinutes(newStart) + 45),
                isCustomLabel: true
            });

            updateAndChainSlots();
            saveSettings();
            renderScheduleSlotsManager();
            fetchSchedule();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', fetchSchedule);
    }
}

function renderSchoolHoursPerDaySettings() {
    const container = document.getElementById('schoolHoursPerDayContainer');
    if (!container) return;
    container.innerHTML = '';

    DAY_KEYS.forEach(day => {
        const current = STATE.settings.schoolHoursPerDay[day.id] || { start: '08:00', end: '17:00' };
        const translatedDayLabel = getDayLabel(day.id);
        const row = document.createElement('div');
        row.className = 'day-hours-row';
        row.innerHTML = `
            <span class="day-label">${translatedDayLabel}</span>
            <div class="time-inputs">
                <input type="time" value="${current.start}" data-day="${day.id}" class="day-start-setting">
                <span>–</span>
                <input type="time" value="${current.end}" data-day="${day.id}" class="day-end-setting">
            </div>
        `;
        container.appendChild(row);
    });

    container.querySelectorAll('.day-start-setting').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const d = e.target.getAttribute('data-day');
            if (!STATE.settings.schoolHoursPerDay[d]) STATE.settings.schoolHoursPerDay[d] = {};
            STATE.settings.schoolHoursPerDay[d].start = e.target.value;
            saveSettings();
            fetchSchedule();
        });
    });

    container.querySelectorAll('.day-end-setting').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const d = e.target.getAttribute('data-day');
            if (!STATE.settings.schoolHoursPerDay[d]) STATE.settings.schoolHoursPerDay[d] = {};
            STATE.settings.schoolHoursPerDay[d].end = e.target.value;
            saveSettings();
            fetchSchedule();
        });
    });
}

function renderScheduleSlotsManager() {
    const container = document.getElementById('scheduleSlotsContainer');
    if (!container) return;

    container.innerHTML = '';
    const { language } = STATE.settings;
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    const slots = STATE.settings.scheduleSlots;

    slots.forEach((slot, idx) => {
        const isLast = idx === slots.length - 1;
        const card = document.createElement('div');
        card.className = 'slot-item-card';
        card.setAttribute('draggable', 'true');
        card.setAttribute('data-idx', idx);

        card.innerHTML = `
            <div class="drag-handle" title="Drag to reorder">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="5" r="1.5"></circle>
                    <circle cx="15" cy="5" r="1.5"></circle>
                    <circle cx="9" cy="12" r="1.5"></circle>
                    <circle cx="15" cy="12" r="1.5"></circle>
                    <circle cx="9" cy="19" r="1.5"></circle>
                    <circle cx="15" cy="19" r="1.5"></circle>
                </svg>
            </div>
            <select data-idx="${idx}" class="slot-type-select">
                <option value="lesson" ${slot.type === 'lesson' ? 'selected' : ''}>${t.slotTypeLesson || 'Lesson'}</option>
                <option value="break" ${slot.type === 'break' ? 'selected' : ''}>${t.slotTypeBreak || 'Break'}</option>
            </select>
            <input type="text" value="${slot.label}" placeholder="Label" data-idx="${idx}" class="slot-name-input">
            <input type="time" value="${slot.start}" data-idx="${idx}" class="slot-start-input">
            ${isLast ? `<span class="slot-time-arrow">–</span><input type="time" value="${slot.end}" data-idx="${idx}" class="slot-end-input">` : ''}
            <button class="remove-break-btn" data-idx="${idx}">&times;</button>
        `;

        card.addEventListener('dragstart', (e) => {
            STATE.draggedSlotIndex = idx;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', idx);
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('drag-over');
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            const targetIdx = parseInt(card.getAttribute('data-idx'), 10);
            const sourceIdx = STATE.draggedSlotIndex;

            if (sourceIdx !== null && sourceIdx !== targetIdx) {
                const [movedItem] = STATE.settings.scheduleSlots.splice(sourceIdx, 1);
                STATE.settings.scheduleSlots.splice(targetIdx, 0, movedItem);

                updateAndChainSlots();

                saveSettings();
                renderScheduleSlotsManager();
                fetchSchedule();
            }
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            STATE.draggedSlotIndex = null;
        });

        container.appendChild(card);
    });

    container.querySelectorAll('.slot-type-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const i = parseInt(e.target.getAttribute('data-idx'), 10);
            STATE.settings.scheduleSlots[i].type = e.target.value;
            saveSettings();
            fetchSchedule();
        });
    });

    container.querySelectorAll('.slot-name-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const i = parseInt(e.target.getAttribute('data-idx'), 10);
            STATE.settings.scheduleSlots[i].label = e.target.value;
            STATE.settings.scheduleSlots[i].isCustomLabel = true;
            saveSettings();
            fetchSchedule();
        });
    });

    container.querySelectorAll('.slot-start-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const i = parseInt(e.target.getAttribute('data-idx'), 10);
            STATE.settings.scheduleSlots[i].start = e.target.value;
            
            updateAndChainSlots();

            saveSettings();
            renderScheduleSlotsManager();
            fetchSchedule();
        });
    });

    container.querySelectorAll('.slot-end-input').forEach(inp => {
        inp.addEventListener('change', (e) => {
            const i = parseInt(e.target.getAttribute('data-idx'), 10);
            STATE.settings.scheduleSlots[i].end = e.target.value;
            
            updateAndChainSlots();

            saveSettings();
            fetchSchedule();
        });
    });

    container.querySelectorAll('.remove-break-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const i = parseInt(e.target.getAttribute('data-idx'), 10);
            STATE.settings.scheduleSlots.splice(i, 1);

            updateAndChainSlots();

            saveSettings();
            renderScheduleSlotsManager();
            fetchSchedule();
        });
    });
}

async function exchangeCodeForToken(school, code) {
    const url = `https://${school}.zportal.nl/api/v3/oauth/token`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'grant_type': 'authorization_code',
            'code': code
        })
    });

    if (!response.ok) {
        throw new Error('Invalid or expired 12-digit code');
    }

    const data = await response.json();
    return data.access_token;
}

async function fetchSubjectDefinitions() {
    const { school, token } = STATE.auth;
    if (!school || !token) return;

    try {
        const url = `https://${school}.zportal.nl/api/v3/subjects?access_token=${encodeURIComponent(token)}`;
        const response = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            const subjectsList = json.response?.data || [];
            subjectsList.forEach(s => {
                if (s.name && (s.fullName || s.description)) {
                    STATE.subjectsMap[s.name.toLowerCase()] = s.fullName || s.description;
                }
            });
        }
    } catch (e) {
        console.warn('Could not fetch subject definitions from API, using fallback map.', e);
    }
}

function saveSettings(syncCloud = true) {
    localStorage.setItem('zermelo_settings', JSON.stringify(STATE.settings));
    if (syncCloud) syncToOrbinuityCloud();
}

function saveCustomEvents(syncCloud = true) {
    localStorage.setItem('zermelo_custom_events', JSON.stringify(STATE.customEvents));
    if (syncCloud) syncToOrbinuityCloud();
}

function closeModal() {
    if (settingsModal) settingsModal.classList.add('hidden');
}

function showDashboard() {
    applyLanguage();
    fetchSubjectDefinitions();
    fetchSchedule();
}

function expandCustomEvents(eventsList, viewStartSec, viewEndSec) {
    const expanded = [];

    eventsList.forEach(ev => {
        if (!ev.repeat || ev.repeat === 'none') {
            if (ev.start < viewEndSec && ev.end > viewStartSec) {
                expanded.push(ev);
            }
        } else if (ev.repeat === 'weekly') {
            const durationSec = (ev.end - ev.start) || 3600;
            let curStart = new Date(ev.start * 1000);
            let curEnd = new Date(ev.end * 1000);

            let repeatUntilMaxSec = Infinity;
            if (ev.repeatEnd === 'until' && ev.repeatUntil) {
                repeatUntilMaxSec = Math.floor(new Date(`${ev.repeatUntil}T23:59:59`).getTime() / 1000);
            }

            while (true) {
                const curStartSec = Math.floor(curStart.getTime() / 1000);
                const curEndSec = curStartSec + durationSec;

                if (curStartSec > viewEndSec || curStartSec > repeatUntilMaxSec) {
                    break;
                }

                if (curEndSec > viewStartSec && curStartSec < viewEndSec) {
                    expanded.push({
                        ...ev,
                        id: `${ev.id}_rep_${curStartSec}`,
                        parentEventId: ev.id,
                        start: curStartSec,
                        end: curEndSec
                    });
                }

                curStart.setDate(curStart.getDate() + 7);
                curEnd.setDate(curEnd.getDate() + 7);
            }
        }
    });

    return expanded;
}

async function fetchSchedule() {
    const { school, user, token } = STATE.auth;
    const { rangeView, showCancelled, startDay, language, showWeekends } = STATE.settings;
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let fetchTotalDays = 7;
    if (rangeView === '7days') {
        fetchTotalDays = showWeekends ? 7 : 11;
    } else if (rangeView === '1week') {
        fetchTotalDays = 7;
    } else if (rangeView === '2weeks') {
        fetchTotalDays = 14;
    } else if (rangeView === '3weeks') {
        fetchTotalDays = 21;
    } else if (rangeView === '4weeks') {
        fetchTotalDays = 28;
    }

    if (rangeView !== '7days' && startDay === 'monday') {
        const dayOfWeek = startDate.getDay();
        const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
        startDate.setDate(startDate.getDate() + diffToMonday);
    }

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = startTimestamp + (86400 * fetchTotalDays);

    let apiAppointments = [];

    if (school && token) {
        if (scheduleContainer) scheduleContainer.innerHTML = `<div class="status-msg">${t.fetching}</div>`;
        const url = `https://${school}.zportal.nl/api/v3/appointments?user=${encodeURIComponent(user)}&access_token=${encodeURIComponent(token)}&start=${startTimestamp}&end=${endTimestamp}`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const json = await response.json();
                apiAppointments = json.response?.data || [];
            }
        } catch (err) {
            console.warn('Error fetching Zermelo timetable, showing local schedule mode.', err);
        }
    }

    if (!showCancelled) {
        apiAppointments = apiAppointments.filter(app => !isAppointmentCancelled(app));
    }

    const expandedCustomEvents = expandCustomEvents(STATE.customEvents, startTimestamp, endTimestamp);
    const combinedAppointments = [...apiAppointments, ...expandedCustomEvents];

    renderStackedWeeksCalendar(combinedAppointments, startDate, fetchTotalDays);
}

function detectOverlaps(dayApps, dayOfWeek) {
    const overlapMap = new Map();
    const activeApps = dayApps.filter(app => !isAppointmentCancelled(app));

    for (let i = 0; i < activeApps.length; i++) {
        for (let j = i + 1; j < activeApps.length; j++) {
            const a = activeApps[i];
            const b = activeApps[j];

            if (a.id && b.id && a.id === b.id) continue;
            if (a.start === b.start && a.end === b.end && a.subjects?.join(',') === b.subjects?.join(',')) {
                continue;
            }

            if (a.start < b.end && a.end > b.start) {
                if (!overlapMap.has(a)) overlapMap.set(a, []);
                if (!overlapMap.has(b)) overlapMap.set(b, []);

                const titleA = a.subjects?.join(', ') || 'Activity';
                const titleB = b.subjects?.join(', ') || 'Activity';

                overlapMap.get(a).push({ type: 'lesson', title: titleB });
                overlapMap.get(b).push({ type: 'lesson', title: titleA });
            }
        }
    }

    return overlapMap;
}

function createAppointmentElement(app, overlapMap, t, locale, use12Hour, topPx, heightPx) {
    const appStart = new Date(app.start * 1000);
    const appEnd = new Date(app.end * 1000);

    const startTimeStr = formatTimeString(`${String(appStart.getHours()).padStart(2, '0')}:${String(appStart.getMinutes()).padStart(2, '0')}`, locale, use12Hour);
    const endTimeStr = formatTimeString(`${String(appEnd.getHours()).padStart(2, '0')}:${String(appEnd.getMinutes()).padStart(2, '0')}`, locale, use12Hour);

    const subjectCodes = app.subjects || [];
    const lang = STATE.settings.language;
    const niceNames = subjectCodes.map(code => getSubjectNiceName(code, lang));
    const displayTitle = niceNames.join(', ') || subjectCodes.join(', ') || 'Activity';

    const location = app.locations?.join(', ') || 'N/A';
    const teacher = app.teachers?.join(', ') || 'N/A';

    const overlaps = overlapMap.get(app) || [];
    const hasOverlap = overlaps.length > 0;

    const isCancelled = isAppointmentCancelled(app);
    const hasRemark = !isCancelled && !!(app.changeDescription || app.remark);
    const remarkText = app.changeDescription || app.remark || '';

    const isTodo = app.isCustom && app.isTodo;

    const appDiv = document.createElement('div');
    appDiv.className = `appointment ${isCancelled ? 'cancelled' : ''} ${isTodo ? 'todo-event' : ''} ${hasOverlap ? 'has-overlap' : ''} ${hasRemark ? 'has-remark' : ''}`;
    appDiv.style.top = `${topPx}px`;
    appDiv.style.height = `${heightPx}px`;

    let badgeMetaHtml = '';
    if (isTodo) {
        badgeMetaHtml = `
            <span class="badge todo-badge">${t.todoTag || 'To-Do'}</span>
            ${location && location !== 'N/A' ? `<span class="badge">${location}</span>` : ''}
        `;
    } else {
        const showTeacher = teacher && teacher !== 'N/A' && teacher !== 'Custom';
        badgeMetaHtml = `
            <span class="badge">${location}</span>
            ${showTeacher ? `<span class="badge">${teacher}</span>` : ''}
        `;
    }

    appDiv.innerHTML = `
        <div class="app-title">
            <span class="${isCancelled ? 'title-cancelled' : ''}">${displayTitle}</span>
            <div style="display:flex; gap:0.2rem; align-items:center;">
                ${isCancelled ? `<span class="cancelled-tag">${t.cancelledTag || 'Cancelled'}</span>` : ''}
                ${hasOverlap ? `<span class="overlap-warning-tag">Overlap</span>` : ''}
                ${hasRemark ? `<span class="remark-tag" title="${remarkText}">${remarkText}</span>` : ''}
            </div>
        </div>
        <div class="app-time">${startTimeStr} – ${endTimeStr}</div>
        <div class="app-meta">
            ${badgeMetaHtml}
        </div>
    `;

    appDiv.addEventListener('click', () => openLessonModal(app, overlaps));
    return appDiv;
}

function renderSingleDayBlock(dayData, appointments, locale, dateFormat, timeFormat, schoolHoursPerDay, dayOverrides, todayKey, t, weekBlock) {
    const use12Hour = timeFormat === '12h';
    const dateKey = getLocalDateKey(dayData.date);
    const dayOfWeek = dayData.date.getDay();
    const dayName = dayData.date.toLocaleDateString(locale, { weekday: 'short' });
    const dateFormatted = formatDate(dayData.date, dateFormat, locale, true);

    const dayConfig = dayOverrides[dateKey] || schoolHoursPerDay[dayOfWeek] || { start: '08:00', end: '17:00' };
    const isNoSchool = !!(dayOverrides[dateKey]?.isNoSchool);
    const isToday = dateKey === todayKey;

    const slots = STATE.settings.scheduleSlots || getDefaultSlots(locale);

    let minHour = parseInt((dayConfig.start || '08:00').split(':')[0], 10);
    let maxHour = parseInt((dayConfig.end || '17:00').split(':')[0], 10);

    dayData.appointments.forEach(app => {
        const startH = new Date(app.start * 1000).getHours();
        const endH = Math.ceil(new Date(app.end * 1000).getHours() + (new Date(app.end * 1000).getMinutes() / 60));
        if (startH < minHour) minHour = Math.max(0, startH);
        if (endH > maxHour) maxHour = Math.min(24, endH);
    });

    minHour = Math.min(minHour, 8);
    maxHour = Math.max(maxHour, 17);

    const hourHeight = 72;
    const startMin = timeToMinutes(`${String(minHour).padStart(2, '0')}:00`);
    const endMin = timeToMinutes(`${String(maxHour).padStart(2, '0')}:00`);
    const totalMinutes = Math.max(endMin - startMin, 60);
    const totalGridHeight = (totalMinutes / 60) * hourHeight;

    const calWrapper = document.createElement('div');
    calWrapper.className = 'calendar-wrapper';

    const timeAxis = document.createElement('div');
    timeAxis.className = 'time-axis';
    timeAxis.style.height = `${totalGridHeight}px`;

    slots.forEach((s) => {
        const curMin = timeToMinutes(s.start);
        if (curMin >= startMin && curMin <= endMin) {
            const topPx = timeToY(curMin, startMin, hourHeight);
            const tickDiv = document.createElement('div');
            tickDiv.className = 'time-tick';
            tickDiv.style.top = `${topPx}px`;

            const formattedTime = formatTimeString(s.start, locale, use12Hour);
            tickDiv.innerHTML = `<span>${formattedTime}</span><span class="hour-num">${s.label}</span>`;
            timeAxis.appendChild(tickDiv);
        }
    });

    const daysGrid = document.createElement('div');
    daysGrid.className = 'days-grid';
    daysGrid.style.gridTemplateColumns = '1fr';

    const dayCol = document.createElement('div');
    dayCol.className = `day-column ${isToday ? 'is-today' : ''} ${isNoSchool ? 'is-no-school' : ''}`;

    const dayHeaderHtml = `
        <div class="day-header">
            <div class="day-header-left">
                <span class="day-name">${dayName}</span>
                <span class="day-date">${dateFormatted}</span>
            </div>
            <div class="day-header-actions">
                <button class="day-pdf-btn" title="Download PDF for ${dayName}">
                    <svg width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </button>
                <button class="day-edit-btn" data-date="${dateKey}" title="Customize hours for ${dayName}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 16 14"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    `;

    const dayBody = document.createElement('div');
    dayBody.className = 'day-body';
    dayBody.style.height = `${totalGridHeight}px`;

    slots.forEach((s) => {
        const curMin = timeToMinutes(s.start);
        if (curMin >= startMin && curMin <= endMin) {
            const topPx = timeToY(curMin, startMin, hourHeight);
            const hourLine = document.createElement('div');
            hourLine.className = 'hour-grid-line';
            hourLine.style.top = `${topPx}px`;
            dayBody.appendChild(hourLine);
        }

        if (s.type === 'break') {
            const breakStartMin = timeToMinutes(s.start);
            const breakEndMin = timeToMinutes(s.end);

            if (breakEndMin > startMin && breakStartMin < endMin) {
                const topPx = timeToY(breakStartMin, startMin, hourHeight);
                const bottomPx = timeToY(breakEndMin, startMin, hourHeight);
                const heightPx = Math.max(bottomPx - topPx, 20);

                const breakStartFmt = formatTimeString(s.start, locale, use12Hour);
                const breakEndFmt = formatTimeString(s.end, locale, use12Hour);

                const breakDiv = document.createElement('div');
                breakDiv.className = 'break-period';
                breakDiv.style.top = `${topPx}px`;
                breakDiv.style.height = `${heightPx}px`;
                breakDiv.innerHTML = `<span class="break-label">${s.label} (${breakStartFmt} – ${breakEndFmt})</span>`;
                dayBody.appendChild(breakDiv);
            }
        }
    });

    if (!isNoSchool && dayConfig.start && dayConfig.end) {
        const dayStartMin = timeToMinutes(dayConfig.start);
        const dayEndMin = timeToMinutes(dayConfig.end);

        const startLabelText = (t.boundStart || 'Start').toUpperCase();
        const endLabelText = (t.boundEnd || 'End').toUpperCase();

        if (dayStartMin >= startMin && dayStartMin <= endMin) {
            const startTopPx = timeToY(dayStartMin, startMin, hourHeight);
            const startLine = document.createElement('div');
            startLine.className = 'school-bound-line';
            startLine.style.top = `${startTopPx}px`;
            startLine.innerHTML = `<span class="school-bound-label">${startLabelText} ${formatTimeString(dayConfig.start, locale, use12Hour)}</span>`;
            dayBody.appendChild(startLine);
        }

        if (dayEndMin >= startMin && dayEndMin <= endMin) {
            const endTopPx = timeToY(dayEndMin, startMin, hourHeight);
            const endLine = document.createElement('div');
            endLine.className = 'school-bound-line';
            endLine.style.top = `${endTopPx}px`;
            endLine.innerHTML = `<span class="school-bound-label">${endLabelText} ${formatTimeString(dayConfig.end, locale, use12Hour)}</span>`;
            dayBody.appendChild(endLine);
        }
    }

    if (isNoSchool) {
        const noSchoolDiv = document.createElement('div');
        noSchoolDiv.className = 'no-school-overlay';
        noSchoolDiv.innerHTML = `<span class="no-school-badge">${t.noSchoolLabel || 'No School / Day Off'}</span>`;
        dayBody.appendChild(noSchoolDiv);
    }

    const overlapMap = detectOverlaps(dayData.appointments, dayOfWeek);

    dayData.appointments.forEach(app => {
        const appStart = new Date(app.start * 1000);
        const appEnd = new Date(app.end * 1000);

        const appStartMin = appStart.getHours() * 60 + appStart.getMinutes();
        const appEndMin = appEnd.getHours() * 60 + appEnd.getMinutes();

        const topPx = timeToY(appStartMin, startMin, hourHeight);
        const bottomPx = timeToY(appEndMin, startMin, hourHeight);
        const heightPx = Math.max(bottomPx - topPx, 32);

        const appDiv = createAppointmentElement(app, overlapMap, t, locale, use12Hour, topPx, heightPx);
        dayBody.appendChild(appDiv);
    });

    dayCol.innerHTML = dayHeaderHtml;
    dayCol.appendChild(dayBody);

    dayCol.querySelector('.day-edit-btn').addEventListener('click', () => {
        openDayHoursModal(dateKey, dayName, dateFormatted, dayOfWeek);
    });

    dayCol.querySelector('.day-pdf-btn').addEventListener('click', () => {
        setPrintOrientation(false);
        document.body.classList.remove('printing-week');
        document.body.classList.add('printing-single-day');

        document.querySelectorAll('.week-block').forEach(wb => wb.classList.remove('print-active'));
        document.querySelectorAll('.calendar-wrapper').forEach(cw => cw.classList.remove('has-active-day'));
        document.querySelectorAll('.day-column').forEach(dc => dc.classList.remove('print-active-day'));

        if (weekBlock) weekBlock.classList.add('print-active');
        calWrapper.classList.add('has-active-day');
        dayCol.classList.add('print-active-day');

        window.print();

        setTimeout(() => {
            document.body.classList.remove('printing-single-day');
            if (weekBlock) weekBlock.classList.remove('print-active');
            calWrapper.classList.remove('has-active-day');
            dayCol.classList.remove('print-active-day');
        }, 1000);
    });

    daysGrid.appendChild(dayCol);
    calWrapper.appendChild(timeAxis);
    calWrapper.appendChild(daysGrid);

    return calWrapper;
}

function renderStackedWeeksCalendar(appointments, startDate, fetchTotalDays) {
    if (!scheduleContainer) return;
    scheduleContainer.innerHTML = '';
    const { timeFormat, dateFormat, language, showWeekends, rangeView, schoolHoursPerDay, dayOverrides } = STATE.settings;
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;
    const locale = language === 'nl' ? 'nl-NL' : 'en-US';
    const use12Hour = timeFormat === '12h';

    const slots = STATE.settings.scheduleSlots || getDefaultSlots(language);
    const now = new Date();
    const todayKey = getLocalDateKey(now);

    if (rangeView === '7days') {
        const weekBlock = document.createElement('div');
        weekBlock.className = 'week-block';
        weekBlock.id = `week_block_7days`;

        const validDays = [];
        let dayOffset = 0;

        while (validDays.length < 7) {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + dayOffset);
            const dayOfWeek = dayDate.getDay();

            if (showWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
                validDays.push(dayDate);
            }
            dayOffset++;
            if (dayOffset > 30) break;
        }

        const firstDay = validDays[0];
        const lastDay = validDays[validDays.length - 1];
        const firstDateStr = formatDMMM(firstDay, locale);
        const lastDateStr = formatDMMM(lastDay, locale);

        const weekHeaderRow = document.createElement('div');
        weekHeaderRow.className = 'week-header-row';
        weekHeaderRow.innerHTML = `
            <span class="week-title">${t.view7Days || 'Next 7 Days'} (${firstDateStr} – ${lastDateStr})</span>
        `;
        weekBlock.appendChild(weekHeaderRow);

        const stackedFeed = document.createElement('div');
        stackedFeed.className = 'stacked-days-feed';

        validDays.forEach(d => {
            const key = getLocalDateKey(d);
            const dayApps = appointments.filter(app => getLocalDateKey(new Date(app.start * 1000)) === key);

            const dayData = { date: d, appointments: dayApps };
            const dayWrapper = renderSingleDayBlock(dayData, appointments, locale, dateFormat, timeFormat, schoolHoursPerDay, dayOverrides, todayKey, t, weekBlock);
            stackedFeed.appendChild(dayWrapper);
        });

        weekBlock.appendChild(stackedFeed);
        scheduleContainer.appendChild(weekBlock);
        return;
    }

    const weeksList = [];
    let currentWeekDays = [];

    for (let i = 0; i < fetchTotalDays; i++) {
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + i);
        const dayOfWeek = dayDate.getDay();

        if (i > 0 && dayOfWeek === 1 && currentWeekDays.length > 0) {
            weeksList.push(currentWeekDays);
            currentWeekDays = [];
        }

        if (showWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
            currentWeekDays.push(dayDate);
        }
    }
    if (currentWeekDays.length > 0) {
        weeksList.push(currentWeekDays);
    }

    weeksList.forEach((weekDays, weekIdx) => {
        const weekBlock = document.createElement('div');
        weekBlock.className = 'week-block';
        weekBlock.id = `week_block_${weekIdx}`;

        const firstDay = weekDays[0];
        const lastDay = weekDays[weekDays.length - 1];
        const firstDateStr = formatDMMM(firstDay, locale);
        const lastDateStr = formatDMMM(lastDay, locale);

        const weekHeaderRow = document.createElement('div');
        weekHeaderRow.className = 'week-header-row';
        weekHeaderRow.innerHTML = `
            <span class="week-title">${t.weekPrefix} ${getWeekNumber(firstDay)} (${firstDateStr} – ${lastDateStr})</span>
            <button class="btn-secondary week-pdf-btn" style="gap:0.3rem; padding: 0.25rem 0.6rem; font-size: 0.75rem;" title="Download PDF for this week">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>${t.pdfBtn || 'PDF'}</span>
            </button>
        `;
        weekBlock.appendChild(weekHeaderRow);

        weekHeaderRow.querySelector('.week-pdf-btn').addEventListener('click', () => {
            setPrintOrientation(true);
            document.body.classList.remove('printing-single-day');
            document.body.classList.add('printing-week');

            document.querySelectorAll('.week-block').forEach(wb => wb.classList.remove('print-active'));
            weekBlock.classList.add('print-active');

            window.print();

            setTimeout(() => {
                document.body.classList.remove('printing-week');
                weekBlock.classList.remove('print-active');
            }, 1000);
        });

        const calWrapper = document.createElement('div');
        calWrapper.className = 'calendar-wrapper';

        const weekDayMap = new Map();
        const weekApps = [];

        weekDays.forEach(d => {
            const key = getLocalDateKey(d);
            weekDayMap.set(key, { date: d, appointments: [] });
        });

        appointments.forEach(app => {
            const appDate = new Date(app.start * 1000);
            const key = getLocalDateKey(appDate);
            if (weekDayMap.has(key)) {
                weekDayMap.get(key).appointments.push(app);
                weekApps.push(app);
            }
        });

        let minHour = 24;
        let maxHour = 0;

        weekDays.forEach(d => {
            const key = getLocalDateKey(d);
            const dayOfWeek = d.getDay();
            const dayConfig = dayOverrides[key] || schoolHoursPerDay[dayOfWeek] || { start: '08:00', end: '17:00' };

            const sH = parseInt((dayConfig.start || '08:00').split(':')[0], 10);
            const eH = parseInt((dayConfig.end || '17:00').split(':')[0], 10);

            if (sH < minHour) minHour = sH;
            if (eH > maxHour) maxHour = eH;
        });

        if (minHour >= maxHour) {
            minHour = 8;
            maxHour = 17;
        }

        weekApps.forEach(app => {
            const startH = new Date(app.start * 1000).getHours();
            const endH = Math.ceil(new Date(app.end * 1000).getHours() + (new Date(app.end * 1000).getMinutes() / 60));
            if (startH < minHour) minHour = Math.max(0, startH);
            if (endH > maxHour) maxHour = Math.min(24, endH);
        });

        minHour = Math.min(minHour, 8);
        maxHour = Math.max(maxHour, 17);

        const hourHeight = 72;
        const startMin = timeToMinutes(`${String(minHour).padStart(2, '0')}:00`);
        const endMin = timeToMinutes(`${String(maxHour).padStart(2, '0')}:00`);
        const totalMinutes = Math.max(endMin - startMin, 60);
        const totalGridHeight = (totalMinutes / 60) * hourHeight;

        const timeAxis = document.createElement('div');
        timeAxis.className = 'time-axis';
        timeAxis.style.height = `${totalGridHeight}px`;

        slots.forEach((s) => {
            const curMin = timeToMinutes(s.start);
            if (curMin >= startMin && curMin <= endMin) {
                const topPx = timeToY(curMin, startMin, hourHeight);
                const tickDiv = document.createElement('div');
                tickDiv.className = 'time-tick';
                tickDiv.style.top = `${topPx}px`;

                const formattedTime = formatTimeString(s.start, locale, use12Hour);
                tickDiv.innerHTML = `<span>${formattedTime}</span><span class="hour-num">${s.label}</span>`;
                timeAxis.appendChild(tickDiv);
            }
        });

        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';

        weekDayMap.forEach((dayData, dateKey) => {
            const isToday = dateKey === todayKey;
            const dayOfWeek = dayData.date.getDay();
            const dayName = dayData.date.toLocaleDateString(locale, { weekday: 'short' });
            const dateFormatted = formatDate(dayData.date, dateFormat, locale, true);

            const dayConfig = dayOverrides[dateKey] || schoolHoursPerDay[dayOfWeek] || { start: '08:00', end: '17:00' };
            const isNoSchool = !!(dayOverrides[dateKey]?.isNoSchool);
            const overlapMap = detectOverlaps(dayData.appointments, dayOfWeek);

            const dayCol = document.createElement('div');
            dayCol.className = `day-column ${isToday ? 'is-today' : ''} ${isNoSchool ? 'is-no-school' : ''}`;

            const dayHeaderHtml = `
                <div class="day-header">
                    <div class="day-header-left">
                        <span class="day-name">${dayName}</span>
                        <span class="day-date">${dateFormatted}</span>
                    </div>
                    <div class="day-header-actions">
                        <button class="day-pdf-btn" title="Download PDF for ${dayName}">
                            <svg width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                        <button class="day-edit-btn" data-date="${dateKey}" title="Customize hours for ${dayName}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 16 14"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            `;

            const dayBody = document.createElement('div');
            dayBody.className = 'day-body';
            dayBody.style.height = `${totalGridHeight}px`;

            slots.forEach((s) => {
                const curMin = timeToMinutes(s.start);
                if (curMin >= startMin && curMin <= endMin) {
                    const topPx = timeToY(curMin, startMin, hourHeight);
                    const hourLine = document.createElement('div');
                    hourLine.className = 'hour-grid-line';
                    hourLine.style.top = `${topPx}px`;
                    dayBody.appendChild(hourLine);
                }

                if (s.type === 'break') {
                    const breakStartMin = timeToMinutes(s.start);
                    const breakEndMin = timeToMinutes(s.end);

                    if (breakEndMin > startMin && breakStartMin < endMin) {
                        const topPx = timeToY(breakStartMin, startMin, hourHeight);
                        const bottomPx = timeToY(breakEndMin, startMin, hourHeight);
                        const heightPx = Math.max(bottomPx - topPx, 20);

                        const breakStartFmt = formatTimeString(s.start, locale, use12Hour);
                        const breakEndFmt = formatTimeString(s.end, locale, use12Hour);

                        const breakDiv = document.createElement('div');
                        breakDiv.className = 'break-period';
                        breakDiv.style.top = `${topPx}px`;
                        breakDiv.style.height = `${heightPx}px`;
                        breakDiv.innerHTML = `<span class="break-label">${s.label} (${breakStartFmt} – ${breakEndFmt})</span>`;
                        dayBody.appendChild(breakDiv);
                    }
                }
            });

            if (!isNoSchool && dayConfig.start && dayConfig.end) {
                const dayStartMin = timeToMinutes(dayConfig.start);
                const dayEndMin = timeToMinutes(dayConfig.end);

                const startLabelText = (t.boundStart || 'Start').toUpperCase();
                const endLabelText = (t.boundEnd || 'End').toUpperCase();

                if (dayStartMin >= startMin && dayStartMin <= endMin) {
                    const startTopPx = timeToY(dayStartMin, startMin, hourHeight);
                    const startLine = document.createElement('div');
                    startLine.className = 'school-bound-line';
                    startLine.style.top = `${startTopPx}px`;
                    startLine.innerHTML = `<span class="school-bound-label">${startLabelText} ${formatTimeString(dayConfig.start, locale, use12Hour)}</span>`;
                    dayBody.appendChild(startLine);
                }

                if (dayEndMin >= startMin && dayEndMin <= endMin) {
                    const endTopPx = timeToY(dayEndMin, startMin, hourHeight);
                    const endLine = document.createElement('div');
                    endLine.className = 'school-bound-line';
                    endLine.style.top = `${endTopPx}px`;
                    endLine.innerHTML = `<span class="school-bound-label">${endLabelText} ${formatTimeString(dayConfig.end, locale, use12Hour)}</span>`;
                    dayBody.appendChild(endLine);
                }
            }

            if (isNoSchool) {
                const noSchoolDiv = document.createElement('div');
                noSchoolDiv.className = 'no-school-overlay';
                noSchoolDiv.innerHTML = `<span class="no-school-badge">${t.noSchoolLabel || 'No School / Day Off'}</span>`;
                dayBody.appendChild(noSchoolDiv);
            }

            if (isToday) {
                const currentMin = now.getHours() * 60 + now.getMinutes();
                if (currentMin >= startMin && currentMin <= endMin) {
                    const nowTop = timeToY(currentMin, startMin, hourHeight);
                    const timelineBar = document.createElement('div');
                    timelineBar.className = 'timeline-bar';
                    timelineBar.style.top = `${nowTop}px`;
                    timelineBar.innerHTML = `<span class="timeline-ball"></span>`;
                    dayBody.appendChild(timelineBar);
                }
            }

            dayData.appointments.forEach(app => {
                const appStart = new Date(app.start * 1000);
                const appEnd = new Date(app.end * 1000);

                const appStartMin = appStart.getHours() * 60 + appStart.getMinutes();
                const appEndMin = appEnd.getHours() * 60 + appEnd.getMinutes();

                const topPx = timeToY(appStartMin, startMin, hourHeight);
                const bottomPx = timeToY(appEndMin, startMin, hourHeight);
                const heightPx = Math.max(bottomPx - topPx, 32);

                const appDiv = createAppointmentElement(app, overlapMap, t, locale, use12Hour, topPx, heightPx);
                dayBody.appendChild(appDiv);
            });

            dayCol.innerHTML = dayHeaderHtml;
            dayCol.appendChild(dayBody);

            dayCol.querySelector('.day-edit-btn').addEventListener('click', () => {
                openDayHoursModal(dateKey, dayName, dateFormatted, dayOfWeek);
            });

            dayCol.querySelector('.day-pdf-btn').addEventListener('click', () => {
                setPrintOrientation(false);
                document.body.classList.remove('printing-week');
                document.body.classList.add('printing-single-day');

                document.querySelectorAll('.week-block').forEach(wb => wb.classList.remove('print-active'));
                document.querySelectorAll('.calendar-wrapper').forEach(cw => cw.classList.remove('has-active-day'));
                document.querySelectorAll('.day-column').forEach(dc => dc.classList.remove('print-active-day'));

                if (weekBlock) weekBlock.classList.add('print-active');
                calWrapper.classList.add('has-active-day');
                dayCol.classList.add('print-active-day');

                window.print();

                setTimeout(() => {
                    document.body.classList.remove('printing-single-day');
                    if (weekBlock) weekBlock.classList.remove('print-active');
                    calWrapper.classList.remove('has-active-day');
                    dayCol.classList.remove('print-active-day');
                }, 1000);
            });

            daysGrid.appendChild(dayCol);
        });

        calWrapper.appendChild(timeAxis);
        calWrapper.appendChild(daysGrid);
        weekBlock.appendChild(calWrapper);
        scheduleContainer.appendChild(weekBlock);
    });
}

function openDayHoursModal(dateKey, dayName, dateFormatted, dayOfWeek) {
    STATE.activeDayOverrideKey = dateKey;
    if (dayHoursTitle) dayHoursTitle.textContent = `${dayName} (${dateFormatted}) Hours`;
    
    const dayDefault = STATE.settings.schoolHoursPerDay[dayOfWeek] || { start: '08:00', end: '17:00' };
    const existing = STATE.settings.dayOverrides[dateKey] || dayDefault;
    const t = TRANSLATIONS[STATE.settings.language] || TRANSLATIONS.en;

    if (dayStartInput) dayStartInput.value = existing.start || '08:00';
    if (dayEndInput) dayEndInput.value = existing.end || '17:00';

    const isNoSchool = !!(STATE.settings.dayOverrides[dateKey]?.isNoSchool);
    if (markNoSchoolBtn) {
        if (isNoSchool) {
            markNoSchoolBtn.textContent = '✓ ' + (t.noSchoolLabel || 'No School');
            markNoSchoolBtn.classList.add('active-no-school');
        } else {
            markNoSchoolBtn.textContent = t.markNoSchool || 'No School';
            markNoSchoolBtn.classList.remove('active-no-school');
        }
    }

    if (dayHoursModal) dayHoursModal.classList.remove('hidden');
}

function openLessonModal(app, overlappingItems) {
    STATE.activeOpenedApp = app;
    const { timeFormat, dateFormat, language } = STATE.settings;
    const locale = language === 'nl' ? 'nl-NL' : 'en-US';
    const use12Hour = timeFormat === '12h';
    const t = TRANSLATIONS[language] || TRANSLATIONS.en;

    const appStart = new Date(app.start * 1000);
    const appEnd = new Date(app.end * 1000);

    const dateFormatted = formatDate(appStart, dateFormat, locale);
    const dayNameStr = appStart.toLocaleDateString(locale, { weekday: 'long' });

    const startTimeStr = formatTimeString(`${String(appStart.getHours()).padStart(2, '0')}:${String(appStart.getMinutes()).padStart(2, '0')}`, locale, use12Hour);
    const endTimeStr = formatTimeString(`${String(appEnd.getHours()).padStart(2, '0')}:${String(appEnd.getMinutes()).padStart(2, '0')}`, locale, use12Hour);

    const subjectCodes = app.subjects || [];
    const niceNames = subjectCodes.map(code => getSubjectNiceName(code, language));

    const displaySubjectCode = subjectCodes.join(', ') || 'N/A';
    const displayFullName = niceNames.join(', ') || displaySubjectCode;

    const modalTitle = document.getElementById('lessonModalTitle');
    const modalFullName = document.getElementById('lessonModalFullName');
    const modalCode = document.getElementById('lessonModalCode');
    const modalTime = document.getElementById('lessonModalTime');
    const modalRoom = document.getElementById('lessonModalRoom');
    const modalTeacher = document.getElementById('lessonModalTeacher');
    const modalGroup = document.getElementById('lessonModalGroup');

    if (modalTitle) modalTitle.textContent = displayFullName;
    if (modalFullName) modalFullName.textContent = displayFullName;
    if (modalCode) modalCode.textContent = displaySubjectCode;
    if (modalTime) modalTime.textContent = `${dayNameStr}, ${dateFormatted} (${startTimeStr} – ${endTimeStr})`;
    if (modalRoom) modalRoom.textContent = app.locations?.join(', ') || 'N/A';
    if (modalTeacher) modalTeacher.textContent = app.teachers?.join(', ') || 'N/A';
    if (modalGroup) modalGroup.textContent = app.groups?.join(', ') || 'N/A';

    if (overlappingItems && overlappingItems.length > 0) {
        if (lessonModalOverlapText) {
            const uniqueTitles = [...new Set(overlappingItems.map(item => item.title))].join(', ');
            lessonModalOverlapText.textContent = `${t.overlapWarningText} ${uniqueTitles}`;
        }
        if (overlapWarningRow) overlapWarningRow.classList.remove('hidden');
    } else {
        if (overlapWarningRow) overlapWarningRow.classList.add('hidden');
    }

    const isCancelled = isAppointmentCancelled(app);

    const statusBadge = document.getElementById('lessonModalStatus');
    if (statusBadge) {
        if (isCancelled) {
            statusBadge.textContent = t.cancelledTag || 'Cancelled';
            statusBadge.classList.remove('hidden');
        } else {
            statusBadge.classList.add('hidden');
        }
    }

    const remarkRow = document.getElementById('remarkRow');
    if (remarkRow) {
        if (app.changeDescription || app.remark) {
            const remarkVal = document.getElementById('lessonModalRemark');
            if (remarkVal) remarkVal.textContent = app.changeDescription || app.remark;
            remarkRow.classList.remove('hidden');
        } else {
            remarkRow.classList.add('hidden');
        }
    }

    if (deleteCustomEventFooter) {
        if (app.isCustom) {
            deleteCustomEventFooter.classList.remove('hidden');
        } else {
            deleteCustomEventFooter.classList.add('hidden');
        }
    }

    if (lessonModal) lessonModal.classList.remove('hidden');
}

function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}