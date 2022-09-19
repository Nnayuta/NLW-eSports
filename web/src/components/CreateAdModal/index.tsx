import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { Check, GameController } from 'phosphor-react';
import React, { FormEvent, useEffect, useState } from 'react';
import Input from '../Form/input';
import axios from 'axios';

// https://www.radix-ui.com/

export interface IGame {
    id: string,
    title: string,
}

interface Iad {
    name: string,
    yearsPlaying: number,
    discord: string,
    weekDays: string[],
    hourStart: string,
    hourEnd: string,
    useVoiceChannel: boolean
}

const CreateAdModal: React.FC = () => {

    const [games, setGames] = useState<IGame[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false)

    useEffect(() => {
        axios('http://localhost:3333/games').then(response => setGames(response.data))
    }, [])

    async function handleCreateAd(event: FormEvent) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement)
        const data = Object.fromEntries(formData)
        console.log(data)

        try {
            await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                weekDays: weekDays.map(Number),
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel: useVoiceChannel
            })
            alert("Anúncio criado com sucesso!")
        } catch (error) {
            console.log(error)
            alert("Erro ao criar o anuncio!")
        }


    }

    return (
        <Dialog.Portal>
            <Dialog.Overlay className="bg-black/60 inset-0 fixed">
                <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
                    <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>
                    <form onSubmit={handleCreateAd} className='mt-8 flex flex-col gap-4'>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold" htmlFor="game">Qual o game?</label>
                            {/* TODO: usa o radix para subistituir o select */}
                            <select
                                name="game"
                                id="game"
                                className='bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none'
                                defaultValue={0}
                                required
                            >
                                <option value="">Selecione o game que deseja jogar</option>
                                {games.map(game => <option key={game.id} value={game.id}>{game.title}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Qual o game?</label>
                            <Input name='name' id='name' type='text' placeholder='Como te chamam dentro do game?' required/>
                        </div>

                        <div className='grid grid-cols-2 gap-6'>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
                                <Input name='yearsPlaying' id='yearsPlaying' type="number" placeholder='Tudo bem ser ZERO' required/>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="discord">Qual seu Discord?</label>
                                <Input name='discord' id='discord' type="text" placeholder='Usuario#0000' required/>
                            </div>
                        </div>

                        <div className='flex gap-6'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="weekDays">Quando costuma jogar?</label>
                                <ToggleGroup.Root
                                    type='multiple'
                                    className='grid grid-cols-4 gap-2'
                                    value={weekDays}
                                    onValueChange={setWeekDays}
                                >
                                    <ToggleGroup.Item
                                        value="0"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Domingo'>D</ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="1"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Segunda'>S</ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="2"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Terça'>T</ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="3"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Quarta'>Q</ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="4"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Quinta'>Q</ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="5"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Sexta'>S</ToggleGroup.Item>
                                    <ToggleGroup.Item
                                        value="6"
                                        className={`w-8 h-8 rounded  ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}
                                        title='Sabado'>S</ToggleGroup.Item>
                                </ToggleGroup.Root>
                            </div>
                            <div className='flex flex-col gap-2 flex-1' >
                                <label htmlFor="hours">Qual horario do dia?</label>
                                <div id='hours' className='grid grid-cols-2 gap-2'>
                                    <Input type="time" name='hourStart' id="hourStart" placeholder='De' required/>
                                    <Input type="time" name='hourEnd' id="hourEnd" placeholder='Ate' required/>
                                </div>
                            </div>
                        </div>

                        <label className='mt-2 flex gap-2 items-center text-sm '>
                            <Checkbox.Root
                                checked={useVoiceChannel}
                                onCheckedChange={(checked) => checked === true ? setUseVoiceChannel(true) : setUseVoiceChannel(false)}
                                className='w-6 h-6 rounded bg-zinc-900 p-1'>
                                <Checkbox.Indicator><Check className='w-4 h-4 text-emerald-400' /></Checkbox.Indicator>
                            </Checkbox.Root>
                            Costumo me conectar ao chat de voz
                        </label>

                        <footer className='mt-4 flex justify-end gap-4'>
                            <Dialog.Close type='button'
                                className='bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600'
                            >Cancelar</Dialog.Close>
                            <button
                                className='bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600'
                                type="submit">
                                <GameController size={24} />
                                Encontrar Duo</button>
                        </footer>
                    </form>
                </Dialog.Content>
            </Dialog.Overlay>
        </Dialog.Portal>
    )
}

export default CreateAdModal;