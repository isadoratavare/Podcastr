import { createContext, useState, ReactNode, useContext } from 'react';
import Episode from '../pages/episodes/[slug]';

type Episode = {
    title:string,
    members: string,
    thumbnail:string,
    duration: number,
    url: string
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[],index:number) => void;
    setPlayingState: (state:boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext:boolean;
    hasPrevious: boolean;
}
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrenteEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode){
        setEpisodeList([episode])
        setCurrenteEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number){
        setEpisodeList(list);
        setCurrenteEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay(){
        setIsPlaying(!isPlaying);
    }
    function toggleLoop(){
        setIsLooping(!isLooping);
    }
    function toggleShuffle(){
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean){
        setIsPlaying(state);
    }
    
    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = currentEpisodeIndex + 1 < episodeList.length

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setCurrenteEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrenteEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious(){
        if(hasPrevious){
            setCurrenteEpisodeIndex(currentEpisodeIndex - 1)
        }
    }

    return (
        <PlayerContext.Provider 
        value={{ 
            episodeList,
            currentEpisodeIndex, 
            play,
            playList,
            isPlaying,
            isShuffling,
            playNext,
            playPrevious,
            togglePlay,
            setPlayingState,
            hasNext,
            hasPrevious,
            toggleLoop,
            isLooping,
            toggleShuffle
            }}
        >
            {children}

        </PlayerContext.Provider>)
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}