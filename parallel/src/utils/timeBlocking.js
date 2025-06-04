//============================================================================//
//                                                                            //
//                                                                            //
//                          Time Blocking Algorithmn                          //
//                                     by                                     //
//                                  Lachlan                                   //
//                                                                            //
//                                                                            //
//============================================================================//


// Time-Blocking v1 allocateTaskstoTimeSlots 
export function allocateTasksToTimeSlotsOLD(streams, events, tasks, dayStart, dayEnd)
{
    // (1) Sort Events : Trim events within the dayStart and dayEnd in order
    const sortedEvents = [...events] // Copy Events Array
    .map(event => ({
        start: new Date(event.start),
        end: new Date(event.end || (new Date(event.start).getTime() + 60 * 60000))
    }))
    .filter(event => event.end > dayStart && event.start < dayEnd) // Filter within dayStart and dayEnd
    .sort((a, b) => a.start - b.start); // Sort Events

    // (2) Calculate Free Slots Between Events
    const freeSlots = [];
    
    if(sortedEvents.length === 0)
    {
        freeSlots.push({
            start: new Date(dayStart),
            end: new Date(dayEnd)
        });
    }
    else // There are events to calculate free slots around
    {

        let currentTime = new Date(dayStart);
        
        // Iterate over sortedEvents 
        for(const event of sortedEvents)
        {
            if(currentTime < event.start)
            {
                freeSlots.push({
                    start: new Date(currentTime), // Free slot starts from dayStart OR when it was updated
                    end: new Date(event.start) // Free slot ends at the beginning of a new event
                });
            }

            // Updating currentTime 
            if(currentTime < event.end)
            {
                currentTime = new Date(event.end); // New free slots will begin after the event ends
            }
        }

        // After the last event add another freeslot (IF not at the end of the day ...)
        if(currentTime < new Date(dayEnd))
        {
            freeSlots.push({
                start: new Date(currentTime),
                end: new Date(dayEnd)
            });
        }
    }
    
    // (3) Fit Tasks into Free Slots

    // Set up empty array to return tasks ...
    const scheduledTasks = [];

    // Iterate over tasks needing to be added to the calendar, and then over the free slots available
    for(const task of tasks)
    {
        for(const slot of freeSlots)
        {
            const slotDuration = (slot.end - slot.start) / 60000;

            if(slotDuration >= task.duration)
            {
                const start = new Date(slot.start);
                const end = new Date(slot.start.getTime() + task.duration * 60000);
            
                scheduledTasks.push({
                    ...task, // Preserve all orginal task properties
                    start, // Add the task start time
                    end // Add the task end time
                });

                // Update the slot because we have just filled it with a task ...
                slot.start = end;

                // Now break as we just placed the task ...
                break;
            }
        }
    }

    return scheduledTasks;
}



// Time-Blocks Tasks Over A Given Period (Mon - Wed) OR just a given day (Mon)
// dateStartIndex : 0 = monday, 1 = tuesday, etc 
// dateEndIndex : 0 = monday, 1 = tuesday, etc
export function retrieveScheduledTasks(streams, events, tasks, dateStartIndex, dateEndIndex, currentDisplayedDate)
{
    const scheduledTasksGlobal = [];

    // Annoying logic to set date cursor to the day of the week we are time blocking 
    let dateCursor = new Date(currentDisplayedDate);
    const currentDayOfWeek = dateCursor.getDay(); 
    const daysToMove = dateStartIndex - currentDayOfWeek;
    dateCursor.setDate(dateCursor.getDate() + daysToMove); 
    let loopIndex = dateStartIndex;

    // Time Blocks Over Given Day 
    function allocateTasksToTimeSlots(streams, events, tasks, dayStart, dayEnd)
    {
        const scheduledTasks = [];
        
        // - - - - - - - - - - - - - - - HELPER FUNCTIONS FOR STEP 3 - - - - - - - - - - - - - - - //
        
        function timeToMinutes(str)
        {
            const [h, m] = str.split(":").map(Number);
            return h * 60 + m;
        }
        
        function isInTimePeriod(task, slotStart)
        {
            const stream = streams.find(s=> s.id === task.stream);
            if(!stream || !stream.timePeriods) return false;

            const day = slotStart.getDay(); 
            const startMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
            const endMinutes = Math.round(startMinutes + task.duration);

            return stream.timePeriods.some(p => {
                if (p.day !== day) return false;
                const periodStart = timeToMinutes(p.startTime);
                const periodEnd = timeToMinutes(p.endTime);
                return startMinutes >= periodStart && endMinutes <= periodEnd;
            });
        }
        
        // - - - - - - - - - - - - - - - HELPER FUNCTIONS FOR STEP 3 - - - - - - - - - - - - - - - //
        
        // (1) Sort Events
        const sortedEvents = [...events]
        .map(event => ({
            start: new Date(event.start),
            end: new Date(event.end || (new Date(event.start).getTime() + 60 * 60000))
        }))
        .filter(event => event.end > dayStart && event.start < dayEnd)
        .sort((a, b) => a.start - b.start); 
    
        // (2) Calculate Free Slots Between Events
        const freeSlots = [];
        
        if(sortedEvents.length === 0)
        {
            freeSlots.push({
                start: new Date(dayStart),
                end: new Date(dayEnd)
            });
        }
        else // There are events to calculate free slots around
        {

            let currentTime = new Date(dayStart);
            
            // Iterate over sortedEvents 
            for(const event of sortedEvents)
            {
                if(currentTime < event.start)
                {
                    freeSlots.push({
                        start: new Date(currentTime), // Free slot starts from dayStart OR when it was updated
                        end: new Date(event.start) // Free slot ends at the beginning of a new event
                    });
                }

                // Updating currentTime 
                if(currentTime < event.end)
                {
                    currentTime = new Date(event.end); // New free slots will begin after the event ends
                }
            }

            // After the last event add another freeslot (IF not at the end of the day ...)
            if(currentTime < new Date(dayEnd))
            {
                freeSlots.push({
                    start: new Date(currentTime),
                    end: new Date(dayEnd)
                });
            }
        }

        // (3) : Fit Tasks Into Free Slots (MUST BE WITHIN STREAM PERIOD TOO)
        for(const task of tasks)
        {
            for(const slot of freeSlots)
            {
                const slotDuration = (slot.end - slot.start) / 60000;

                if(slotDuration >= task.duration && isInTimePeriod(task, slot.start))
                {
                    const start = new Date(slot.start);
                    const end = new Date(start.getTime() + task.duration * 60000);

                    scheduledTasks.push({
                        ...task,
                        start,
                        end
                    });

                    slot.start = end;
                    break;
                }

            }
        }

        return scheduledTasks;
    }

    // Start Iterating Over Days
    while(loopIndex <= dateEndIndex)
    {
        const dayStart = new Date(dateCursor);
        dayStart.setHours(0, 0, 0, 0); // 00:00
        
        const dayEnd = new Date(dateCursor);
        dayEnd.setHours(23, 59, 59, 999); // 23:59

        scheduledTasksGlobal.push(allocateTasksToTimeSlots(streams, events, tasks, dayStart, dayEnd));

        // Incrementing to the next day
        loopIndex++;
        dateCursor.setDate(dateCursor.getDate() + 1); 
    }

    return scheduledTasksGlobal;
}