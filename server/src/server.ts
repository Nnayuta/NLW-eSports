import express, { Request, Response } from 'express';
import cors from 'cors'

import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinutes } from './utils/convert-hour-string-to-minute';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string';

const app = express();

app.use(express.json())
app.use(cors())

// { origin: "http://localhost"}
//TODO:  usar o Zod para validação

const prisma = new PrismaClient()

//

app.get('/games', async (req: Request, res: Response) => {
    try {
        const games = await prisma.game.findMany({
            include: {
                _count: {
                    select: {
                        ads: true
                    }
                }
            }
        })

        return res.json(games)

    } catch (error) {
        return res.status(500).json(error)
    }
})

interface Iad {
    name: string,
    yearsPlaying: number,
    discord: string,
    weekDays: string[],
    hourStart: string,
    hourEnd: string,
    useVoiceChannel: boolean
}

app.post("/games/:id/ads", async (request: Request, response: Response) => {
    const gameId = request.params.id
    const body = request.body as Iad

    // Validação Zod

    try {
        const ad = await prisma.ad.create({
            data: {
                gameId,
                name: body.name,
                yearsPlaying: body.yearsPlaying,
                discord: body.discord,
                weekDays: body.weekDays.join(','),
                hourStart: convertHourStringToMinutes(body.hourStart),
                hourEnd: convertHourStringToMinutes(body.hourEnd),
                useVoiceChannel: body.useVoiceChannel
            }
        })

        return response.status(201).json(ad)
    } catch (error) {
        return response.status(500).json({ error })
    }
})

app.get("/games/:id/ads", async (request: Request, response: Response) => {
    const gameId = request.params.id

    try {
        const ads = await prisma.ad.findMany({
            where: {
                gameId
            },
            select: {
                id: true,
                name: true,
                weekDays: true,
                useVoiceChannel: true,
                yearsPlaying: true,
                hourStart: true,
                hourEnd: true
            },
            orderBy: {
                createAt: 'desc'
            }
        })

        return response.json(ads.map(ad => {
            return {
                ...ad,
                weekDays: ad.weekDays.split(','),
                hourStart: convertMinutesToHourString(ad.hourStart),
                hourEnd: convertMinutesToHourString(ad.hourEnd),

            }
        }))
    } catch (error) {
        return response.status(500).json({ error })
    }


})

app.get("/ads/:id/discord", async (request: Request, response: Response) => {
    const adId = request.params.id

    try {
        const ad = await prisma.ad.findUniqueOrThrow({
            where: {
                id: adId,
            },
            select: {
                discord: true
            }
        })

        return response.json(ad)
    } catch (error) {
        return response.status(500).json({ error })
    }
})

const Port = 3333;
app.listen(Port, () => {
    console.log(`Rodando na porta: ${Port}`)
})