const { v4: uuidv4 } = require("uuid");
const dynamoDB = require("../config/dynamo");

exports.createEvent = async (req, res) => {
    try {
        const { title, description, category, date, location, price, status } = req.body;

        const organizerId = req.organizer.organizerId;

        const eventId = uuidv4();

        const params = {
            TableName: "Events",
            Item: {
                eventId,
                organizerId,
                title,
                description,
                category,
                date,
                location,
                price: parseFloat(price) || 0,
                status: status || "PUBLISHED",
                createdAt: new Date().toISOString()
            }
        };

        await dynamoDB.put(params).promise();

        res.status(201).json({
            message: "Event created successfully",
            eventId
        });

    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({
            message: "Failed to create event"
        });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const params = {
            TableName: "Events"
        };

        const data = await dynamoDB.scan(params).promise();

        // Users should only see PUBLISHED events (or legacy events without status)
        const publishedEvents = (data.Items || []).filter(
            event => event.status === "PUBLISHED" || !event.status
        );

        res.status(200).json(publishedEvents);

    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            message: "Failed to fetch events"
        });
    }
};


/* ==============================
   REGISTER FOR EVENT
============================== */

exports.registerEvent = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.userId; // from JWT middleware

        if (!eventId) {
            return res.status(400).json({
                message: "Event ID is required"
            });
        }

        // Check if registration already exists
        const checkParams = {
            TableName: "EventRegisterations",
            FilterExpression: "userId = :userId AND eventId = :eventId",
            ExpressionAttributeValues: {
                ":userId": userId,
                ":eventId": eventId
            }
        };
        const checkResult = await dynamoDB.scan(checkParams).promise();
        if (checkResult.Items && checkResult.Items.length > 0) {
            return res.status(400).json({
                message: "You are already registered for this event"
            });
        }

        const params = {
            TableName: "EventRegisterations",
            Item: {
                registerationId: uuidv4(),
                eventId: eventId,
                userId: userId,
                registeredAt: new Date().toISOString()
            }
        };

        await dynamoDB.put(params).promise();

        res.status(200).json({
            message: "Registration successful"
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Registration failed"
        });
    }
};

exports.getUserRegistrations = async (req, res) => {
    try {
        const userId = req.user.userId;

        const regParams = {
            TableName: "EventRegisterations",
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const regData = await dynamoDB.scan(regParams).promise();
        const registrations = regData.Items || [];

        if (registrations.length === 0) {
            return res.status(200).json([]);
        }

        const eventParams = {
            TableName: "Events"
        };
        const eventData = await dynamoDB.scan(eventParams).promise();
        const allEvents = eventData.Items || [];

        const eventsMap = {};
        allEvents.forEach(evt => {
            eventsMap[evt.eventId] = evt;
        });

        const result = registrations.map(reg => {
            const eventInfo = eventsMap[reg.eventId] || null;
            return {
                ...reg,
                event: eventInfo
            };
        }).filter(item => item.event !== null);

        res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching user registrations:", error);
        res.status(500).json({
            message: "Failed to fetch registrations"
        });
    }
};