// Fightcade Game Controller / Numpad Control
// Author: blueminder (Enrique Santos)
// https://enriquesantos.net/

const cabControls = function (fcWindow) {
  const fcDoc = fcWindow.document
  const appStyle = fcWindow.getComputedStyle(fcDoc.querySelector('#app'))

  let columnIndex = 0
  let currentNotification

  const allColumns = ['channels', 'usersOnlineList', 'matchesList', 'testGame', 'trainingGame']
  let columns = allColumns
  let currentColumn = columns[columnIndex]

  // channels
  function setActiveChannel (channelItem, actClick = false) {
    if (channelItem) {
      const title = channelItem.getAttribute('title')
      const channelWrappers = fcDoc.querySelectorAll('.channelWrapper')
      const matchingChannelWrapper = [...channelWrappers].filter((c) => {
        return c.querySelector('.channelContent') &&
          c.querySelector('.channelInfo .name').getAttribute('title') === title
      })[0]
      matchingChannelWrapper.classList.add('selected')

      if (actClick) {
        channelItem.click()
      }
    }
  }

  function deselectChannel () {
    const selectedChannelWrapper = fcDoc.querySelector('.channelWrapper.selected')
    if (selectedChannelWrapper) {
      selectedChannelWrapper.classList.remove('selected')
    }
  }

  function togglePrevChannel () {
    deselectChannel()

    const channels = fcDoc.querySelector('.channelsList').querySelectorAll('.channelItem')
    const currentChannel = fcDoc.querySelector('.channelsList .active')
    let prevChannelIndex = [...channels].indexOf(currentChannel) - 1
    if (prevChannelIndex < 0) {
      prevChannelIndex = channels.length - 1
    }

    setActiveChannel(channels[prevChannelIndex], true)
  }

  function toggleNextChannel () {
    deselectChannel()

    const channels = fcDoc.querySelector('.channelsList').querySelectorAll('.channelItem')
    const currentChannel = fcDoc.querySelector('.channelsList .active')
    let nextChannelIndex = [...channels].indexOf(currentChannel) + 1
    if (nextChannelIndex === channels.length) {
      nextChannelIndex = 0
    }

    setActiveChannel(channels[nextChannelIndex], true)
  }

  // usersOnlineList
  function deselectUser (user) {
    user.style.backgroundColor = ''
    user.classList.remove('selected')
  }

  function selectUser (user) {
    const activeChannel = fcDoc.querySelector('.channelsList .channelItem.active')
    setActiveChannel(activeChannel)

    // console.log(user.querySelector('.playerName').innerHTML.trim())

    const currentUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')
    if (currentUser) {
      deselectUser(currentUser)
    }

    const selectColor = appStyle.getPropertyValue('--mainColor-light')
    user.style.backgroundColor = selectColor
    user.classList.add('selected')
    user.scrollIntoViewIfNeeded()
  }

  function selectPrevUser () {
    const currentUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')

    let targetUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem')
    if (currentUser) {
      const users = fcDoc.querySelectorAll('.channelWrapper.selected .usersOnlineList .userItem')
      let prevUserIndex = [...users].indexOf(currentUser) - 1
      if (prevUserIndex < 0) {
        prevUserIndex = users.length - 1
      }
      if (users[prevUserIndex]) {
        targetUser = users[prevUserIndex]
      }
    }

    selectUser(targetUser)
  }

  function selectNextUser () {
    const currentUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')

    let targetUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem')
    if (currentUser) {
      const users = fcDoc.querySelectorAll('.channelWrapper.selected .usersOnlineList .userItem')
      let nextUserIndex = [...users].indexOf(currentUser) + 1
      if (nextUserIndex > users.length - 1) {
        nextUserIndex = 0
      }
      if (users[nextUserIndex]) {
        targetUser = users[nextUserIndex]
      }
    }

    selectUser(targetUser)
  }

  function focusSelectedUser () {
    const activeChannel = fcDoc.querySelector('.channelsList .channelItem.active')
    setActiveChannel(activeChannel)

    let selectedUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')
    if (!selectedUser) {
      selectedUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem')
      selectUser(selectedUser)
    } else {
      const selectColor = appStyle.getPropertyValue('--mainColor-light')
      selectedUser.style.backgroundColor = selectColor
      selectedUser.scrollIntoViewIfNeeded()
    }
  }

  function defocusSelectedUser () {
    const unfocusedSelectColor = appStyle.getPropertyValue('--mainColor-darker-trans-hi')
    const currentUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')
    if (currentUser) {
      currentUser.style.backgroundColor = unfocusedSelectColor
    }
  }

  function toggleSelectedUser () {
    const selectedUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')
    if (selectedUser) {
      selectedUser.click()
      selectedUser.click()
    }
  }

  // matchList
  function deselectMatch (match) {
    match.style.backgroundColor = ''
    match.classList.remove('selected')
  }

  function selectMatch (match) {
    const activeChannel = fcDoc.querySelector('.channelsList .channelItem.active')
    setActiveChannel(activeChannel)

    // console.log(match.querySelector('.playerName').innerHTML.trim())

    const currentMatch = fcDoc.querySelector(
      '.channelWrapper.selected .usersListToolbar .matchesList .matchItem.selected'
    )
    if (currentMatch) {
      deselectMatch(currentMatch)
    }

    const selectColor = appStyle.getPropertyValue('--mainColor-light')
    match.style.backgroundColor = selectColor
    match.classList.add('selected')
    match.scrollIntoViewIfNeeded()
  }

  function selectPrevMatch () {
    const currentMatch = fcDoc.querySelector(
      '.channelWrapper.selected .usersListToolbar .matchesList .matchItem.selected'
    )

    let targetMatch = fcDoc.querySelector('.channelWrapper.selected .usersListToolbar .matchesList .matchItem')

    if (currentMatch) {
      const matches = fcDoc.querySelectorAll('.channelWrapper.selected .usersListToolbar .matchesList .matchItem')
      let prevMatchIndex = [...matches].indexOf(currentMatch) - 1
      if (prevMatchIndex < 0) {
        prevMatchIndex = matches.length - 1
      }
      if (matches[prevMatchIndex]) {
        targetMatch = matches[prevMatchIndex]
      }
    }

    selectMatch(targetMatch)
  }

  function selectNextMatch () {
    const currentMatch = fcDoc.querySelector('.channelWrapper.selected .matchesList .matchItem.selected')

    let targetMatch = fcDoc.querySelector('.channelWrapper.selected .matchesList .matchItem')
    if (currentMatch) {
      const matches = fcDoc.querySelectorAll('.channelWrapper.selected .matchesList .matchItem')

      let nextMatchIndex = [...matches].indexOf(currentMatch) + 1
      if (nextMatchIndex > matches.length - 1) {
        nextMatchIndex = 0
      }
      if (matches[nextMatchIndex]) {
        targetMatch = matches[nextMatchIndex]
      }
    }

    selectMatch(targetMatch)
  }

  function focusSelectedMatch () {
    const activeChannel = fcDoc.querySelector('.channelsList .channelItem.active')
    setActiveChannel(activeChannel)

    let selectedMatch = fcDoc.querySelector('.channelWrapper.selected .matchesList .matchItem.selected')
    if (!selectedMatch) {
      selectedMatch = fcDoc.querySelector('.channelWrapper.selected .matchesList .matchItem')
      selectMatch(selectedMatch)
    } else {
      const selectColor = appStyle.getPropertyValue('--mainColor-light')
      selectedMatch.style.backgroundColor = selectColor
      selectedMatch.scrollIntoViewIfNeeded()
    }
  }

  function defocusSelectedMatch () {
    const unfocusedSelectColor = appStyle.getPropertyValue('--mainColor-darker-trans-hi')
    const currentMatch = fcDoc.querySelector(
      '.channelWrapper.selected .usersListToolbar .matchesList .matchItem.selected'
    )
    if (currentMatch) {
      currentMatch.style.backgroundColor = unfocusedSelectColor
    }
  }

  function toggleSelectedMatch () {
    const selectedMatch = fcDoc.querySelector('.channelWrapper.selected .matchesList .matchItem.selected')
    selectedMatch.click()
    selectedMatch.click()
  }

  function reconcileClickedChannels () {
    const selectedChannel = fcDoc.querySelector('.channelWrapper.selected .channelInfo .name')
    if (!selectedChannel) {
      return
    }

    const selectedChannelTitle = selectedChannel.getAttribute('title')
    let activeChannel = fcDoc.querySelector('.channelItem.active')
    if (!activeChannel) {
      activeChannel = fcDoc.querySelector('.channelItem')
      setActiveChannel(activeChannel)
    }

    const activeChannelTitle = activeChannel.getAttribute('title')
    if (selectedChannelTitle !== activeChannelTitle) {
      const testGameBtn = fcDoc.querySelector('.channelWrapper.selected .testGame')
      testGameBtn.style.borderColor = ''

      const trainBtn = fcDoc.querySelector('.channelWrapper.selected .trainingGame')
      if (trainBtn) {
        trainBtn.style.borderColor = ''
      }

      columnIndex = 0
      currentColumn = columns[columnIndex]

      deselectChannel(selectedChannel)
      setActiveChannel(activeChannel, true)
    }
  }

  function refreshColumns () {
    reconcileClickedChannels()

    columns = allColumns
    const toRemove = []

    const usersOnlineList = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList')
    if (!usersOnlineList) {
      toRemove.push('usersOnlineList')
    }

    const matchesList = fcDoc.querySelector('.channelWrapper.selected .usersListToolbar .matchesList')
    if (!matchesList) {
      toRemove.push('matchesList')
    }

    const trainBtn = fcDoc.querySelector('.channelWrapper.selected .trainingGame')
    if (!trainBtn) {
      toRemove.push('trainingGame')
    }

    columns = allColumns.filter((c) => !toRemove.includes(c))
  }

  function silentNotify (msg) {
    currentNotification = new fcWindow.Notification(msg, {
      silent: true
    })
  }

  function changeColumnAction () {
    if (currentColumn !== 'matchesList') {
      defocusSelectedMatch()
    }

    if (currentColumn !== 'usersOnlineList') {
      defocusSelectedUser()
    }

    if (currentNotification) {
      currentNotification.close()
    }

    if (currentColumn === 'channels') {
      silentNotify('Switch Lobbies')
    } else if (currentColumn === 'usersOnlineList') {
      silentNotify('Challenge Players')
      focusSelectedUser()
    } else if (currentColumn === 'matchesList') {
      silentNotify('Spectate Matches')
      focusSelectedMatch()
    }

    const testGameBtn = fcDoc.querySelector('.channelWrapper.selected .testGame')
    if (testGameBtn) {
      if (currentColumn === 'testGame') {
        silentNotify('Test Game')
        const accentColor = appStyle.getPropertyValue('--accentColor')
        testGameBtn.style.borderColor = accentColor
      } else {
        testGameBtn.style.borderColor = ''
      }
    }

    const trainBtn = fcDoc.querySelector('.channelWrapper.selected .trainingGame')
    if (trainBtn) {
      if (currentColumn === 'trainingGame') {
        silentNotify('Train')
        const accentColor = appStyle.getPropertyValue('--accentColor')
        trainBtn.style.borderColor = accentColor
      } else {
        trainBtn.style.borderColor = ''
      }
    }
  }

  function prevColumn () {
    if (!fcDoc.querySelector('.channelItem.active')) {
      return
    }

    refreshColumns()
    if (columnIndex <= 0) {
      columnIndex = columns.length - 1
    } else {
      columnIndex = columnIndex - 1
    }
    currentColumn = columns[columnIndex]
    // console.log(currentColumn)

    changeColumnAction()
  }

  function nextColumn () {
    if (!fcDoc.querySelector('.channelItem.active')) {
      return
    }

    refreshColumns()
    if (columnIndex >= columns.length - 1) {
      columnIndex = 0
    } else {
      columnIndex = columnIndex + 1
    }
    currentColumn = columns[columnIndex]
    // console.log(currentColumn)

    changeColumnAction()
  }

  function prevElement () {
    refreshColumns()
    if (currentColumn === 'channels') {
      togglePrevChannel()
    } else if (currentColumn === 'usersOnlineList') {
      selectPrevUser()
    } else if (currentColumn === 'matchesList') {
      selectPrevMatch()
    }
  }

  function nextElement () {
    refreshColumns()
    if (currentColumn === 'channels') {
      toggleNextChannel()
    } else if (currentColumn === 'usersOnlineList') {
      selectNextUser()
    } else if (currentColumn === 'matchesList') {
      selectNextMatch()
    }
  }

  function toggleAction () {
    const pendingChallenges = fcDoc.querySelectorAll('.messageWrapper.challengeRequested .message .challengeContent')

    if (pendingChallenges.length > 0) {
      const lastChallenge = [...pendingChallenges].slice(-1)[0]
      lastChallenge.querySelector('.accept-challenge').click()
    } else {
      if (currentColumn === 'usersOnlineList') {
        toggleSelectedUser()
      } else if (currentColumn === 'matchesList') {
        toggleSelectedMatch()
      } else if (currentColumn === 'testGame') {
        const testGameBtn = fcDoc.querySelector('.channelWrapper.selected .testGame')
        testGameBtn.click()
      } else if (currentColumn === 'trainingGame') {
        const trainBtn = fcDoc.querySelector('.channelWrapper.selected .trainingGame')
        trainBtn.click()
      }
    }
  }

  function cancelAction () {
    const pendingChallenges = fcDoc.querySelectorAll('.messageWrapper.challengeRequested .message .challengeContent')

    if (pendingChallenges.length > 0) {
      const lastChallenge = [...pendingChallenges].slice(-1)[0]
      lastChallenge.querySelector('.decline-challenge').click()
    }
  }

  function spectateRandomMatch () {
    const matches = fcDoc.querySelectorAll('.channelWrapper.selected .matchesList .matchItem')
    const randomIndex = Math.floor(Math.random() * matches.length)
    if (matches[randomIndex]) {
      matches[randomIndex].click()
      matches[randomIndex].click()
    }
  }

  const scrollableColumns = ['usersOnlineList', 'matchesList']

  // numpad
  const keyHeld = new Map()
  const allKeys = ['Numpad4', 'Numpad6', 'Numpad8', 'Numpad2', 'Numpad0', 'NumpadDecimal']
  allKeys.forEach((b) =>
    keyHeld.set(b, false)
  )

  fcDoc.addEventListener('keydown', actKey)

  function actKey (e) {
    if (!fcDoc.hasFocus()) {
      return
    }

    reconcileClickedChannels()

    if (!e.getModifierState('NumLock')) {
      switch (e.code) {
        case 'Numpad4':
          if (!keyHeld[e.code]) {
            prevColumn()
          }
          break
        case 'Numpad6':
          if (!keyHeld[e.code]) {
            nextColumn()
          }
          break
        case 'Numpad8':
          if (!keyHeld[e.code] || scrollableColumns.includes(currentColumn)) {
            prevElement()
          }
          break
        case 'Numpad2':
          if (!keyHeld[e.code] || scrollableColumns.includes(currentColumn)) {
            nextElement()
          }
          break
        case 'Numpad0':
          if (!keyHeld[e.code]) {
            toggleAction()
          }
          break
        case 'NumpadDecimal':
          if (!keyHeld[e.code]) {
            cancelAction()
          }
          break
        case 'F6':
          if (!keyHeld[e.code]) {
            spectateRandomMatch()
          }
          break
      }
      keyHeld[e.code] = true
    }
  }

  fcDoc.addEventListener('keyup', function (e) {
    keyHeld[e.code] = false
  })

  // gamepad
  const up = 12
  const down = 13
  const left = 14
  const right = 15
  let toggle = 0
  let cancel = 1

  function applyCustomControllerProfiles (gamepad) {
    if (gamepad.id === 'Astro city mini Arcade stick (Vendor: 0ca3 Product: 0028)') {
      toggle = 2
      cancel = 1
    }
  }

  const btnHeld = new Map()
  const allBtns = [up, down, left, right, toggle, cancel]
  allBtns.forEach((b) =>
    btnHeld.set(b, false)
  )

  let neutralX = true
  let neutralY = true

  fcWindow.addEventListener('gamepadconnected', function (e) {
    silentNotify('Game Controller Initialized')

    setInterval(function () {
      const gp = navigator.getGamepads()[e.gamepad.index]

      applyCustomControllerProfiles(gp)

      if (fcDoc.hasFocus()) {
        for (let b = 0; b < gp.buttons.length; b++) {
          if (gp.buttons[b].pressed) {
            switch (b) {
              case up:
                if (!btnHeld[b] || scrollableColumns.includes(currentColumn)) {
                  prevElement()
                }
                break
              case down:
                if (!btnHeld[b] || scrollableColumns.includes(currentColumn)) {
                  nextElement()
                }
                break
              case left:
                if (!btnHeld[b]) {
                  prevColumn()
                }
                break
              case right:
                if (!btnHeld[b]) {
                  nextColumn()
                }
                break
              case toggle:
                if (!btnHeld[b]) {
                  toggleAction()
                }
                break
              case cancel:
                if (!btnHeld[b]) {
                  cancelAction()
                }
                break
            }
            btnHeld[b] = true
          } else {
            btnHeld[b] = false
          }
        }

        // analog controls
        const axisThreshold = 0.5
        for (let a = 0; a < 2; a++) {
          const axisVal = gp.axes[a]

          if (axisVal > -axisThreshold && axisVal < axisThreshold) {
            if (a === 0) {
              neutralX = true
            } else if (a === 1) {
              neutralY = true
            }
          }

          if (Math.abs(axisVal) > axisThreshold) {
            // x axis
            if (a === 0 && neutralX) {
              if (axisVal < -axisThreshold) {
                prevColumn()
              } else if (axisVal > axisThreshold) {
                nextColumn()
              }
              neutralX = false
            }
            // y axis
            if (a === 1 &&
                (neutralY || scrollableColumns.includes(currentColumn))) {
              if (axisVal < -axisThreshold) {
                prevElement()
              } else if (axisVal > axisThreshold) {
                nextElement()
              }
              neutralY = false
            }
          }
        }
      }
    }, 120)
  })
}

cabControls(window)
