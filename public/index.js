'use strict';

//list of bats
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const bars = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'freemousse-bar',
  'pricePerHour': 50,
  'pricePerPerson': 20
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'solera',
  'pricePerHour': 100,
  'pricePerPerson': 40
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'la-poudriere',
  'pricePerHour': 250,
  'pricePerPerson': 80
}];

//list of current booking events
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful from step 4
const events = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'booker': 'esilv-bde',
  'barId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'time': 4,
  'persons': 8,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'booker': 'societe-generale',
  'barId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'time': 8,
  'persons': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'booker': 'otacos',
  'barId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'time': 5,
  'persons': 80,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'privateaser': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'eventId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'eventId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'booker',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'bar',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'privateaser',
    'type': 'credit',
    'amount': 0
  }]
}];



//Step 2

function PricingBar(bars, events) {
    let reduction = 1;
    reduction = 1;
    events.forEach(event => {
        bars.forEach(bar => {
            if (event.barId === bar.id) {
                event.price = event.time * bar.pricePerHour + event.persons * bar.pricePerPerson;
                if (event.persons >= 10) {
                    reduction = 0.1;
                }
                if (event.persons >= 20) {
                    reduction = 0.3;
                }
                if (event.persons >= 60) {
                    reduction = 0.5;
                }
                event.price = event.time * bar.pricePerHour + event.persons * (bar.pricePerPerson * reduction);
            }
        });
    })
}


function Commission(events){
    events.forEach(event =>{
        let commission = 0.3*event.price;
        event.commission.insurance = commission/2;
        commission /= 2;
        event.commission.treasury = event.persons;
        commission -= event.persons;
        event.commission.privateaser = commission;
    })
}

function fdeductible(events){
    events.forEach(event =>{
        if(event.options.deductibleReduction){
            event.commission.privateaser += event.persons;
        }
    })
}

function payActors(actors, events){
    actors.forEach(actor =>{
        actor.payment.forEach(payment =>{
            events.forEach(event =>{
                if(event.id === actor.eventId) {
                    if(payment.who === 'booker'){
                        if(event.options.deductibleReduction){
                            payment.amount += event.persons;
                        }
                        payment.amount += event.price;
                    }

                    if(payment.who === 'bar'){
                        payment.amount += (event.price - (event.commission.privateaser + event.commission.treasury + event.commission.insurance));
                    }

                    if(payment.who === 'insurance'){
                        payment.amount += event.commission.insurance;
                    }

                    if(payment.who === 'treasury'){
                        payment.amount += event.commission.treasury;
                    }

                    if(payment.who === 'privateaser'){
                        if(event.options.deductibleReduction){
                            payment.amount += event.persons;
                        }
                        payment.amount += event.commission.privateaser;
                    }
                }
            })
        })
    })
}


PricingBar(events,bars);
Commission(events);
fdeductible(events)

console.log(bars);
console.log(events);
console.log(actors);
