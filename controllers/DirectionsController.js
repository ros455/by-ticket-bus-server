import DirectionsModel from "../models/Directions.js";
import RouteForUsersModel from "../models/RouteForUsers.js";
import TicketModel from "../models/Ticket.js";

const createRouteForUser = async (route, routName, idx) => {
    return RouteForUsersModel.create({
      startRout: route.start,
      endRout: route.end,
      price: route.price,
      daysWork: route.daysWork,
      distance: route.distance,
      duration: route.duration,
      timeStops: route.timeStops,
      timeEnd: route.timeEnd,
      timeStart: route.timeStart,
      routName,
      numberStops: idx
    });
  };

export const create = async (req, res) => {
    try {
        const {newRout, price, drivers, daysWork, description} = req.body;

        let timeAtStop = 0;

        newRout.allStops.forEach((item) => {
            timeAtStop += Number(item.timeStops || 0)
        })

        const data = await DirectionsModel.create({...newRout, timeAtStop, price, drivers, daysWork, description}); 

        if(data) {
             data.allStops.forEach((rout, idx) => {
                createRouteForUser(rout, data.routName, idx)
                rout.childRouts.forEach((child) => {
                    createRouteForUser(child, data.routName, idx)
                })
            })
        }

        const numberSeats = 35;

        if(data) {
            const tickets = [];

            for(let i=1; i <= numberSeats; i++) {
                tickets.push({
                    status: {
                        free: true,
                        bought: false
                    },
                    user: {
                        firstName: '',
                        lastName: '',
                        email: '',
                        phone: '',
                    },
                    seatNumber: i,
                    from: '',
                    to: '',
                    timeFrom: '',
                    timeTo: '',

                })
            }

            await TicketModel.create({
                routName: data.routName,
                tickets
            })
        }

        res.json(data)

    } catch(error) {
        console.log(error);
    }
}

export const getAll = async (req, res) => {
    try {
        const data = await RouteForUsersModel.find();

        res.json(data)
    }catch(error) {
        console.log(error);
    }
}
export const getAllOriginDirection = async (req, res) => {
    try {
        const data = await DirectionsModel.find();

        res.json(data)
    }catch(error) {
        console.log(error);
    }
}