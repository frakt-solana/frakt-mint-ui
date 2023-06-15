import { useEffect, useRef, useState } from 'react'
import moment from 'moment'

export interface TimeLeft {
  days: string
  hours: string
  minutes: string
  seconds: string
}

type UseCountdown = (endTime: number) => TimeLeft

export const useCountdown: UseCountdown = (endTime: number) => {
  const intervalIdRef = useRef<ReturnType<typeof setInterval>>(null)

  const [currentTime, setCurrentTime] = useState<number | null>(null)
  const endTimeMoment = moment.unix(endTime)

  const timeBetween = moment.duration(
    endTimeMoment.diff(moment.unix(currentTime)),
  )

  const formatDateUnit = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`
  }

  useEffect(() => {
    setCurrentTime(moment().unix())

    intervalIdRef.current = setInterval(() => {
      setCurrentTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(intervalIdRef.current)
  }, [])

  return {
    days: formatDateUnit(timeBetween.days()),
    hours: formatDateUnit(timeBetween.hours()),
    minutes: formatDateUnit(timeBetween.minutes()),
    seconds: formatDateUnit(timeBetween.seconds()),
  }
}
