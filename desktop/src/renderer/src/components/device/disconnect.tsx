import { ReactElement, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { IpcEvents } from '@common/ipc-events'
import {
  isNoExitModeAtom,
  serialPortAtom,
  serialPortStateAtom,
  videoDeviceIdAtom,
  videoStateAtom
} from '@renderer/jotai/device'

export const Disconnect = (): ReactElement => {
  const setVideoState = useSetAtom(videoStateAtom)
  const setVideoDeviceId = useSetAtom(videoDeviceIdAtom)
  const setSerialPortState = useSetAtom(serialPortStateAtom)
  const setSerialPort = useSetAtom(serialPortAtom)

  const isNoExitMode = useAtomValue(isNoExitModeAtom)

  useEffect(() => {
    const rmListener = window.electron.ipcRenderer.on(IpcEvents.SERIAL_PORT_DISCONNECTED, () => {
      if (isNoExitMode) {
        setSerialPortState('disconnected')
        return
      }

      setVideoState('disconnected')
      setSerialPortState('disconnected')

      setVideoDeviceId('')
      setSerialPort('')
    })

    return () => {
      rmListener()
    }
  }, [setSerialPort, setSerialPortState, setVideoDeviceId, setVideoState])

  return <></>
}
