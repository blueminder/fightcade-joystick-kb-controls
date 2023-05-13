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

  function resetChannelItemStyles () {
    const channelItems = fcDoc.querySelectorAll('.channelItem')
    channelItems.forEach(function (c) {
      c.style.borderColor = ''
    })
  }

  function adjustColor (color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, (color) =>
      ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
  }

  function defocusActiveChannel () {
    const activeChannel = fcDoc.querySelector('.channelsList .channelItem.active')
    const acBorderColor = appStyle.getPropertyValue('--accentColor')
    activeChannel.style.borderColor = adjustColor(acBorderColor, -200)
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

  function changeColumnAction (notify = true) {
    resetChannelItemStyles()

    if (currentColumn !== 'channels') {
      defocusActiveChannel()
    }

    if (currentColumn !== 'matchesList') {
      defocusSelectedMatch()
    }

    if (currentColumn !== 'usersOnlineList') {
      defocusSelectedUser()
    }

    if (currentNotification) {
      currentNotification.close()
    }

    if (notify) {
      if (currentColumn === 'channels') {
        silentNotify('Switch Lobbies')
      } else if (currentColumn === 'usersOnlineList') {
        silentNotify('Challenge Players')
        focusSelectedUser()
      } else if (currentColumn === 'matchesList') {
        silentNotify('Spectate Matches')
        focusSelectedMatch()
      }
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
    const pendingChallenges = fcDoc.querySelectorAll(
      '.messageWrapper.challengeRequested .message .challengeContent .accept-challenge'
    )

    if (pendingChallenges.length > 0) {
      const lastChallenge = [...pendingChallenges].slice(-1)[0]
      lastChallenge.click()
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
    const pendingChallenges = fcDoc.querySelectorAll(
      '.messageWrapper.requestChallenge .cancel-challenge, .messageWrapper.challengeRequested .decline-challenge'
    )
    if (pendingChallenges.length > 0) {
      const denyLastChallengeRequest = [...pendingChallenges].slice(-1)[0]
      denyLastChallengeRequest.click()
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

  // reset column to channels on click
  fcDoc.addEventListener('click', function () {
    columnIndex = 0
    currentColumn = columns[columnIndex]
    changeColumnAction(false)
  })

  // numpad
  const allKeys = new Map()
  allKeys.set('up', 'Numpad8')
  allKeys.set('down', 'Numpad2')
  allKeys.set('left', 'Numpad4')
  allKeys.set('right', 'Numpad6')
  allKeys.set('toggle', 'Numpad0')
  allKeys.set('cancel', 'NumpadDecimal')

  allKeys.set('spectateRandomMatch', 'F6')

  const keyHeld = new Map()
  for (const val of allKeys.values()) {
    keyHeld.set(val, false)
  }

  fcDoc.addEventListener('keydown', actKey)

  function actKey (e) {
    if (!fcDoc.hasFocus()) {
      return
    }

    reconcileClickedChannels()

    if (!e.getModifierState('NumLock')) {
      switch (e.code) {
        case allKeys.get('left'):
          if (!keyHeld.get(e.code)) {
            prevColumn()
          }
          break
        case allKeys.get('right'):
          if (!keyHeld.get(e.code)) {
            nextColumn()
          }
          break
        case allKeys.get('up'):
          if (!keyHeld.get(e.code) || scrollableColumns.includes(currentColumn)) {
            prevElement()
          }
          break
        case allKeys.get('down'):
          if (!keyHeld.get(e.code) || scrollableColumns.includes(currentColumn)) {
            nextElement()
          }
          break
        case allKeys.get('toggle'):
          if (!keyHeld.get(e.code)) {
            toggleAction()
          }
          break
        case allKeys.get('cancel'):
          if (!keyHeld.get(e.code)) {
            cancelAction()
          }
          break
        case allKeys.get('spectateRandomMatch'):
          if (!keyHeld.get(e.code)) {
            spectateRandomMatch()
          }
          break
      }
      keyHeld.set(e.code, true)
    }
  }

  fcDoc.addEventListener('keyup', function (e) {
    keyHeld.set(e.code, false)
  })

  // gamepad
  const allBtns = new Map()
  allBtns.set('up', 12)
  allBtns.set('down', 13)
  allBtns.set('left', 14)
  allBtns.set('right', 15)
  allBtns.set('toggle', 0)
  allBtns.set('cancel', 1)

  function applyCustomControllerProfiles (gamepad) {
    if (gamepad.id === 'Astro city mini Arcade stick (Vendor: 0ca3 Product: 0028)') {
      allBtns.set('toggle', 2)
      allBtns.set('cancel', 1)
    }
  }

  const btnHeld = new Map()
  const neutralX = new Map()
  const neutralY = new Map()
  const gpIntervalIds = new Map()

  fcWindow.addEventListener('gamepadconnected', function (e) {
    silentNotify('Game Controller Initialized')

    const gpIntervalId = setInterval(function () {
      if (!btnHeld.has(e.gamepad.index)) {
        btnHeld.set(e.gamepad.index, new Map())
        for (const btn of allBtns.keys()) {
          btnHeld.get(e.gamepad.index).set(btn, false)
        }
        neutralX.set(e.gamepad.index, true)
        neutralY.set(e.gamepad.index, true)
      }

      const gp = navigator.getGamepads()[e.gamepad.index]
      applyCustomControllerProfiles(gp)

      if (fcDoc.hasFocus()) {
        for (let b = 0; b < gp.buttons.length; b++) {
          if (gp.buttons[b].pressed) {
            switch (b) {
              case allBtns.get('up'):
                if (!btnHeld.get(gp.index)[b] || scrollableColumns.includes(currentColumn)) {
                  prevElement()
                }
                break
              case allBtns.get('down'):
                if (!btnHeld.get(gp.index)[b] || scrollableColumns.includes(currentColumn)) {
                  nextElement()
                }
                break
              case allBtns.get('left'):
                if (!btnHeld.get(gp.index)[b]) {
                  prevColumn()
                }
                break
              case allBtns.get('right'):
                if (!btnHeld.get(gp.index)[b]) {
                  nextColumn()
                }
                break
              case allBtns.get('toggle'):
                if (!btnHeld.get(gp.index)[b]) {
                  toggleAction()
                }
                break
              case allBtns.get('cancel'):
                if (!btnHeld.get(gp.index)[b]) {
                  cancelAction()
                }
                break
            }
            btnHeld.get(gp.index)[b] = true
          } else {
            btnHeld.get(gp.index)[b] = false
          }
        }

        // analog controls
        const axisThreshold = 0.5
        for (let a = 0; a < 2; a++) {
          const axisVal = gp.axes[a]

          if (axisVal > -axisThreshold && axisVal < axisThreshold) {
            if (a === 0) {
              neutralX.set(gp.index, true)
            } else if (a === 1) {
              neutralY.set(gp.index, true)
            }
          }

          if (Math.abs(axisVal) > axisThreshold) {
            // x axis
            if (a === 0 && neutralX.get(gp.index)) {
              if (axisVal < -axisThreshold) {
                prevColumn()
              } else if (axisVal > axisThreshold) {
                nextColumn()
              }
              neutralX[gp.index] = false
            }
            // y axis
            if (a === 1 &&
                (neutralY.get(gp.index) || scrollableColumns.includes(currentColumn))) {
              if (axisVal < -axisThreshold) {
                prevElement()
              } else if (axisVal > axisThreshold) {
                nextElement()
              }
              neutralY[gp.index] = false
            }
          }
        }
      }
    }, 120)

    gpIntervalIds.set(e.gamepad.index, gpIntervalId)
  })

  fcWindow.addEventListener('gamepaddisconnected', function (e) {
    silentNotify('Game Controller Disconnected')
    clearInterval(gpIntervalIds.get(e.gamepad.index))
    gpIntervalIds.delete(e.gamepad.index)
    btnHeld.delete(e.gamepad.index)
    neutralX.delete(e.gamepad.index)
    neutralY.delete(e.gamepad.index)
  })
}

cabControls(window)
