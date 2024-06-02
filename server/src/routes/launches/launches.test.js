require('dotenv').config();

const request=require('supertest')

const app=require('../../app')
const {mongooseConnect}=require('../../services/mongo')
const {getPlanetsData}=require('../../models/planets.model')

describe('Launches API',()=>{
    beforeAll(async ()=>{
        await mongooseConnect()
        await getPlanetsData()
    })
    
    describe("checks GET/planets ",()=>{
        test("response should be 200 ok",async ()=>{
            const response=await request(app)
            .get('/v1/launches')
            .expect('Content-Type',/json/)
            .expect(200)
        })
    })

    describe("checks POST/planets ",()=>{
        const launchData={
            mission:"Steffwbsdyi Trial",
            rocket:"Stefwtege IS1",
            target:"Kepler-62 f",
            launchDate: "April 16,2030"
        }
        const launchDataWrongDate={
            mission:"Steffwbsdyi Trial",
            rocket:"Stefwtege IS1",
            target:"Kepler-62 f",
            launchDate: "zoto"
        }
        const launchDataNotDate={
            mission:"Steffwbsdyi Trial",
            rocket:"Stefwtege IS1",
            target:"Kepler-62 f",
        }

        test("response should be 201 ok", async ()=>{
            const response=await request(app)
            .post('/v1/launches')
            .send(launchData)
            .expect('Content-Type',/json/)
            .expect(201)

            expect(response.body).toMatchObject(launchDataNotDate)
            

            const requestDate=new Date(launchData.date).valueOf()
            const responseDate=new Date(response.date).valueOf()

            expect(requestDate).toBe(responseDate)
        })

        test("should check if its a valid request",async ()=>{
            const response=await request(app)
            .post('/v1/launches')
            .send(launchDataNotDate)
            .expect('Content-Type',/json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: "Incomoplete Information!"
            })

        })

        test("should check if ita a calid date",async ()=>{
            const response=await request(app)
            .post('/v1/launches')
            .send(launchDataWrongDate)
            .expect('Content-Type',/json/)
            .expect(400)

            expect(response.body).toStrictEqual({
                error: 'Invalid Date!'
            })

        })

    })
})
