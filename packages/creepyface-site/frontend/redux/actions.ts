import { push } from 'connected-react-router'
import { makeActionCreator } from './util'
import getNext from '../get-next'
import { Language, Action, Dispatch, State } from './types'

const receiveMessages = ({
  value,
  messages
}: {
  value: Language
  messages?: { [K: string]: string }
}): Action => {
  document.documentElement.lang = value
  localStorage.setItem('locale', value)
  return {
    type: 'receiveMessages',
    payload: { value, messages }
  }
}

const loadLocaleValue = (value: Language) => (
  dispatch: Dispatch,
  getState: () => State
) => {
  const { locale } = getState()
  dispatch({ type: 'requestMessages', payload: value })
  if (value === 'es') {
    if (!locale.messages) {
      import('../locales/es').then(({ messages }) => {
        dispatch(receiveMessages({ value, messages }))
      })
    } else {
      dispatch(receiveMessages({ value, messages: locale.messages }))
    }
  } else {
    dispatch(receiveMessages({ value, messages: locale.messages }))
  }
}

export const loadLocale = makeActionCreator(() => (dispatch, getState) => {
  const { locale } = getState()
  dispatch(loadLocaleValue(locale.value))
})

export const toggleLocale = makeActionCreator(() => (dispatch, getState) => {
  const { locale } = getState()
  dispatch(loadLocaleValue(locale.value === 'en' ? 'es' : 'en'))
})

export const toggleShortcuts = makeActionCreator(() => dispatch =>
  dispatch({ type: 'toggleShortcuts' })
)

export const restartCreation = makeActionCreator(() => dispatch =>
  dispatch({ type: 'restartCreation' })
)

export const takePicture = makeActionCreator(
  () => (dispatch, getState) => {
    const { shoot } = getState()
    if (shoot) {
      const picture = shoot()
      dispatch({
        type: 'takePicture',
        payload: picture
      })
    }
  },
  ({ shoot }) => !!shoot
)

export const upload = makeActionCreator(
  () => (dispatch, getState) => {
    dispatch({ type: 'requestUpload' })
    const { pictures, permissions } = getState()
    fetch('/upload', {
      credentials: 'include',
      method: 'POST',
      body: (() => {
        var formData = new FormData()

        Object.entries(pictures).forEach(([k, picture]) => {
          if (picture) formData.append(k, picture.blob)
        })

        Object.entries(permissions).forEach(([name, enabled]) => {
          formData.append(name, `${enabled}`)
        })

        return formData
      })()
    })
      .then(res => res.json())
      .then((data: { download: string; view: string }) =>
        dispatch({ type: 'receiveUpload', payload: data })
      )
      .catch(() => dispatch({ type: 'uploadFailed' }))
  },
  ({ pictures }) => getNext(pictures) === undefined
)

export const stopCreation = makeActionCreator(() => dispatch => {
  dispatch({ type: 'restartCreation' })
  dispatch(push('/'))
})

export const requestCount = makeActionCreator(() => dispatch => {
  fetch('/creepyfaces', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(({ count }: { count: number }) =>
      dispatch({ type: 'receiveCount', payload: count })
    )
})

export const toggleCode = makeActionCreator(() => dispatch =>
  dispatch({ type: 'toggleCode' })
)

export const showPermissions = makeActionCreator(() => dispatch =>
  dispatch({ type: 'showPermissions' })
)

export const toggleFirefly = makeActionCreator(() => dispatch =>
  dispatch({ type: 'toggleFirefly' })
)