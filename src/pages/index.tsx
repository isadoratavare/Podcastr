//SSG
import { GetStaticProps } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from "date-fns";
import ptBR from 'date-fns/locale/pt-BR';
import { api } from "../services/api";
import { convertDurationToTimeString } from "../utils/convertDurationtoTimeString";

import styles from './home.module.scss';
import { usePlayer } from "../contexts/PlayerContext";

type Episode = {
    id: string;
    title: string;
    thumbnail: string,
    members: string;
    duration: number,
    durationAsString:string,
    url:string,
    publishedAt: string;
}

type HomeProps = {
  latestEpisodes,
  allEpisodes
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos </h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
            return(
              //componente image do next: faz o upload da imagem do tamanho que queremos carregar
              <li key={episode.id}> 
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover" />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt} </span>
                  <span className={styles.dot}>•</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button type="button" onClick={() => playList(episodeList,index)}>
                   <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>
              </li>
            )
          }
            )}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>
          <table cellSpacing={0}>
              <thead>
                <tr>
                  <th></th>
                  <th>Podcast</th>
                  <th>Integrantes</th>
                  <th>Data</th>
                  <th>Duração</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {allEpisodes.map((episode,index) =>{
                  return (
                    <tr key={episode.id}>
                      <td>
                        <Image
                          width={120}
                          height={120}
                          src={episode.thumbnail}
                          alt={episode.title}
                          objectFit="cover"
                        />
                      </td>
                      <td>
                        <Link href={`/episodes/${episode.id}`}>
                          <a>{episode.title}</a>
                        </Link>
                      </td>
                      <td>{episode.members}</td>
                      <td style={{ width: 80}}>{episode.publishedAt}</td>
                      <td>{episode.durationAsString}</td>
                      <td>
                        <button type='button' onClick={() => playList(episodeList,index + latestEpisodes.length)}>
                            <img src="/play-green.svg" alt="Tocar episódio"/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
          </table>
      </section>
    </div>
  )
}
export const getStaticProps: GetStaticProps = async () =>{
  //pegando os dados da API
  const { data } = await api.get('episodes',{
    params: {
      _limit:12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })
  //formatação do dados adquiridos na API
  const episodes = data.map(episode => {
      return {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR}),   //data convertido
        duration: Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        url: episode.file.url,
        
      };
    }  
  )

  const latestEpisodes = episodes.slice(0,2)
  const allEpisodes = episodes.slice(2,episodes.length)

  return{
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 60 * 8
  }
}
