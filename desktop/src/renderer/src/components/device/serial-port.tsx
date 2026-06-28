import { ReactElement, useEffect, useState } from 'react'
import { Select } from 'antd'
import { useAtom } from 'jotai'
import { useTranslation } from 'react-i18next'

import { IpcEvents } from '@common/ipc-events'
import { baudRateAtom, serialPortAtom, serialPortStateAtom } from '@renderer/jotai/device'
import * as storage from '@renderer/libs/storage'

type Option = {
  value: string
  label: string
}

type SerialPortProps = {
  setMsg: (msg: string) => void
}

export const SerialPort = ({ setMsg }: SerialPortProps): ReactElement => {
  const { t } = useTranslation()

  const [serialPort, setSerialPort] = useAtom(serialPortAtom)
  const [serialPortState, setSerialPortState] = useAtom(serialPortStateAtom)
  const [baudRate, setBaudRate] = useAtom(baudRateAtom)

  const [options, setOptions] = useState<Option[]>([])
  const [isFailed, setIsFailed] = useState(false)

  useEffect(() => {
    const savedBaudRate = storage.getBaudRate()
    setBaudRate(savedBaudRate)

    getSerialPorts(true)

    const rmListener = window.electron.ipcRenderer.on(IpcEvents.OPEN_SERIAL_PORT_RSP, (_, err) => {
      if (err === '') {
        setSerialPortState('connected')
      } else {
        setIsFailed(true)
        setSerialPort('')
        setSerialPortState('disconnected')
        storage.setSerialPort('')
        setMsg(err)
      }
    })

    return (): void => {
      rmListener()
    }
  }, [])

  async function getSerialPorts(autoOpen: boolean): Promise<void> {
    const serialPorts: { path: string; friendlyName?: string }[] = await window.electron.ipcRenderer.invoke(IpcEvents.GET_SERIAL_PORTS)
    setOptions(serialPorts.map((sp) => ({ value: sp.path, label: sp.friendlyName || sp.path })))

    if (autoOpen) {
      let port = storage.getSerialPort()
      let portExists = port && serialPorts.some((sp) => sp.path === port)
      if (!portExists) {
        const defaultPort = serialPorts.find(
          (sp) =>
            sp.friendlyName?.toLowerCase().includes('usb-serial ch340') ||
            sp.path.toLowerCase().includes('usb-serial ch340')
        )
        if (defaultPort) {
          port = defaultPort.path
          portExists = true
        }
      }
      if (portExists && port) {
        const savedBaudRate = storage.getBaudRate()
        await selectSerialPort(port, savedBaudRate)
      }
    }
  }

  async function selectSerialPort(port: string, customBaudRate?: number): Promise<void> {
    if (serialPortState === 'connecting') return
    setSerialPortState('connecting')
    setIsFailed(false)
    setMsg('')

    const rate = customBaudRate ?? baudRate
    const success = await window.electron.ipcRenderer.invoke(IpcEvents.OPEN_SERIAL_PORT, port, rate)

    if (success) {
      setSerialPort(port)
      storage.setSerialPort(port)
    } else {
      setSerialPortState('disconnected')
    }
  }

  return (
    <Select
      value={serialPort || undefined}
      style={{ width: 280 }}
      options={options}
      loading={serialPortState === 'connecting'}
      status={isFailed ? 'error' : undefined}
      placeholder={t('modal.selectSerial')}
      onChange={(serialPort) => selectSerialPort(serialPort)}
      onClick={() => getSerialPorts(false)}
    />
  )
}
