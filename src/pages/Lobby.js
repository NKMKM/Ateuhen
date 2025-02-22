import React from 'react'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const Lobby = () => {

    const players = [
        { id: 1, nickname: 'Player1', status: 'online', level: 10 },
        { id: 2, nickname: 'Player2', status: 'offline', level: 5 },
        { id: 3, nickname: 'Player3', status: 'in-game', level: 15 },
        { id: 4, nickname: 'Player4', status: 'online', level: 20 },
        { id: 5, nickname: 'Player5', status: 'offline', level: 8 },
    ];

    const maps = [
        { id: 1, name: "Dust II" },
        { id: 2, name: "Mirage" },
        { id: 3, name: "Inferno" },
        { id: 4, name: "Overpass" },
        { id: 5, name: "Nuke" },
    ];


    const maxPlayers = 5; // Максимальное количество игроков в лобби
  return (
    <>
        {/* контейнер чтобы расположить навбар слева и в строку идет след контенер со всем остальным контенетом */}
        <div className='flex flex-row'>
            
            
            {/* навбар слева вертикальный */}
            <nav className='w-[60px] h-screen border-r-[1px] border-gray-900 z-10'>
                <div className='flex flex-col space-y-10 items-center'>
                    <div className='w-[35px] h-[35px] rounded-full bg-gray-500 mt-4'><img></img></div>
                    <ul className='flex flex-col space-y-10'>
                        <li className='scale-150 custom-shadow '><SupervisorAccountIcon className='cursor-pointer inline'/></li>
                        <li className='scale-150 '><MapIcon className='cursor-pointer'/></li>
                        <li className='scale-150 '><SettingsIcon className='cursor-pointer'/></li>

                    </ul>

                </div>
            </nav>
            
            
            {/* контейнер чтобы получилось разделить левый навбар и всю остальную часть сайта  */}
            <div className='w-full '>
                {/* вертикальный хэдер  */}
                <div className='flex flex-row justify-between w-full items-center px-10'>
                    <h1 className='font-bold text-3xl'>Ateuhen</h1>

                    <div className='flex flex-row'>
                        <NotificationsNoneOutlinedIcon className='scale-150 flex self-center mr-6'/>

                        <div className='flex flex-row bg-gray-900 rounded-xl px-4 items-center h-[60px] space-x-3'>
                            <div className='w-[35px] h-[35px] rounded-full bg-gray-500'><img></img></div>
                            <p>CMDR_123</p>
                        </div>
                    </div>
                </div>

                {/* само лобби */}
                <div className="rounded-xl border-2 border-gray-900 p-12 my-20 mx-5">

                    <div className='flex flex-row justify-between   mb-5'>
                        <div className="text-lg font-bold mb-4 ">
                            <p>{`${players.length}/${maxPlayers} players`}</p>
                        </div>

                        <div className='flex flex-row items-center space-x-3 mr-3'>
                            <SupervisorAccountIcon className='cursor-pointer inline'/>
                            <h1 className='text-lg font-bold'>team_$Phantom</h1>
                        </div>
                    </div>
                    
                    <div className="flex justify-between  ">
                        
                        {players.map(player => (
                        <div key={player.id} className="w-[300px] bg-black rounded-lg p-4 shadow-lg border-[1px] h-[350px] flex flex-col items-center space-y-10">
                            <div className='w-[150px] h-[150px] rounded-full bg-gray-500'><img></img></div>
                            <div className="text-center">
                                <p className="text-2xl font-bold mb-2">{player.nickname}</p>
                                <p className="text-sm text-gray-600 mb-2">{player.status}</p>
                                <p className="font-bold ">{`LVL: ${player.level}`}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                    

                </div>

                {/* пул карт */}
                
                <div className='rounded-xl border-2 border-gray-900 p-12 my-20 mx-5'>
                    <div className='flex flex-row my-4 space-x-3'>
                        <MapIcon className='cursor-pointer scale-150'/>
                        <h1 className='font-bold text-lg self-center'>Maps</h1>
                    </div>

                    <div className="w-full flex flex-row  mx-auto justify-between">
                        {maps.map(map => (
                            <div key={map.id} className="w-[300px] bg-black rounded-lg border-[1.4px] border-gray-300 h-[150px]">
                                <div className='w-full h-full bg-gray-500 flex flex-col'>
                                    <img alt={map.name} />
                                    <h1 className='mt-auto flex justify-baseline mx-auto font-bold text-3xl'>{map.name}</h1>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className=' w-[400px] flex flex-col text-center space-y-4 mx-auto mb-20 '>
                    <button className='w-[400px] border-[1px] h-[80px] border-gray-900 text-5xl font-bold scale-hover'>PLAY</button>
                    <p className='text-gray-600'>ACTIVE PLAYERS: 1234</p>

                </div>


            </div>






        </div>

    </>
  )
}

export default Lobby