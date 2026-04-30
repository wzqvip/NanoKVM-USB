import { ReactElement, useEffect, useState } from 'react'
import { Divider, Select, Switch } from 'antd'
import { useAtom } from 'jotai'
import { LanguagesIcon, MonitorIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { IpcEvents } from '@common/ipc-events'
import languages from '@renderer/i18n/languages'
import { isImmersiveModeAtom } from '@renderer/jotai/device'
import { setLanguage } from '@renderer/libs/storage'
import * as storage from '@renderer/libs/storage'

export const Appearance = (): ReactElement => {
  const { t, i18n } = useTranslation()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isImmersiveMode, setIsImmersiveMode] = useAtom(isImmersiveModeAtom)


  const options = languages.map((language) => ({
    value: language.key,
    label: language.name
  }))

  useEffect(() => {
    const isOpen = storage.getIsMenuOpen()
    setIsMenuOpen(isOpen)
  }, [])

  function changeLanguage(value: string): void {
    if (i18n.language === value) return

    i18n.changeLanguage(value)
    setLanguage(value)
  }

  function toggleMenu(): void {
    const isOpen = !isMenuOpen

    setIsMenuOpen(isOpen)
    storage.setIsMenuOpen(isOpen)
  }

  function toggleImmersiveMode(): void {
    const isImmersive = !isImmersiveMode

    setIsImmersiveMode(isImmersive)
    window.electron.ipcRenderer.send(IpcEvents.SET_FULL_SCREEN, isImmersive)
  }

  return (
    <>
      <div className="text-base font-bold">{t('settings.appearance.title')}</div>
      <Divider />

      {/* language */}
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center space-x-1">
          <LanguagesIcon size={16} />
          <span>{t('settings.appearance.language')}</span>
        </div>

        <Select
          defaultValue={i18n.language}
          style={{ width: 180 }}
          options={options}
          onSelect={changeLanguage}
        />
      </div>

      {/* menu bar */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <span>{t('settings.appearance.menu')}</span>
          <span className="text-xs text-neutral-500">{t('settings.appearance.menuTips')}</span>
        </div>

        <Switch value={isMenuOpen} onChange={toggleMenu} />
      </div>

      {/* immersive mode */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <MonitorIcon size={16} />
            <span>{t('settings.appearance.immersiveMode')}</span>
          </div>
          <span className="text-xs text-neutral-500">
            {t('settings.appearance.immersiveModeTips')}
          </span>
        </div>

        <Switch value={isImmersiveMode} onChange={toggleImmersiveMode} />
      </div>
    </>
  )
}
