export function convertDurationtoTimeString(duration: number){
    //Obtendo horas e arredondando para baixo
    const hours = Math.floor(duration / 3600)
    //Obtendo minutos e arredondando para baixo
    const minutes = Math.floor((duration % 3600)/60)
    //Obtendo segundos
    const seconds = Math.floor((duration % 3600)/60)

    const timeString = [hours,minutes,seconds]
        //Percorrendo o resultado para toda vez que o número tiver sozinho
        //'1' , '2', ...
        //Adicionar o 0 na frente
        .map(unit => String(unit).padStart(2,'0'))
        .join(':') //Unindo por :
    return timeString;
}