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
  function setActiveChannel(channelItem, actClick = false) {
    if (channelItem) {
      const title = channelItem.getAttribute('title')
      // search
      if (!title) {
        if (actClick) {
          channelItem.click()
        }
        return
      }
      const channelWrappers = fcDoc.querySelectorAll('.channelWrapper')
      const matchingChannelWrapper = [...channelWrappers].filter((c) => {
        return c.querySelector('.channelContent') &&
          c.querySelector('.channelInfo .name')
          .getAttribute('title') === title
      })[0]
      matchingChannelWrapper.classList.add('selected')

      if (actClick) {
        channelItem.click()
      }
    }
  }

  function deselectChannel() {
    const selectedChannelWrapper = fcDoc.querySelector('.channelWrapper.selected')
    if (selectedChannelWrapper) {
      selectedChannelWrapper.classList.remove('selected')
    }
  }

  function togglePrevChannel() {
    deselectChannel()
    resetChannelItemStyles()

    const channels = fcDoc.querySelectorAll('.channelsList .channelItem')
    const currentChannel = fcDoc.querySelector('.channelsList .active')

    let prevChannelIndex = -1

    if (currentChannel) {
      prevChannelIndex = [...channels].indexOf(currentChannel) - 1
    }

    if (prevChannelIndex < 0) {
      prevChannelIndex = channels.length - 1
    }

    setActiveChannel(channels[prevChannelIndex], true)
  }

  function toggleNextChannel() {
    deselectChannel()
    resetChannelItemStyles()

    const channels = fcDoc.querySelectorAll('.channelsList .channelItem')
    const currentChannel = fcDoc.querySelector('.channelsList .active')

    let nextChannelIndex = 0

    if (currentChannel) {
      nextChannelIndex = [...channels].indexOf(currentChannel) + 1
    }

    if (nextChannelIndex === channels.length) {
      nextChannelIndex = 0
    }

    setActiveChannel(channels[nextChannelIndex], true)
  }

  function leaveChannel() {
    // search
    const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc.querySelector(
        '.searchWrapper')
      .style.display === ''
    if (searchActive) {
      let searchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper.selected')
      if (fcDoc.querySelector('.welcomeWrapper')
        .style.display === 'none') {
        searchEntry = fcDoc.querySelector(
          '.searchResultsGrid .channelWrapper.selected, .searchResultsWrapper .button-alt.selected:not(.disabled)'
        )
      }

      if (searchEntry) {
        deselectSearchEntry(searchEntry)
      }

      const firstSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper')
      selectSearchEntry(firstSearchEntry)
      deselectSearchEntry(firstSearchEntry)

      const searchBtn = fcDoc.querySelector('.channelsList .buttonItemWrapper')
      searchBtn.click()
      return
    }

    const currentChannel = fcDoc.querySelector('.channelsList .channelItem.active')
    if (currentChannel) {
      const currentChannelWrapper = currentChannel.parentElement
      const leaveChannelBtn = currentChannelWrapper.querySelector('.leaveChannelItem')
      if (leaveChannelBtn) {
        leaveChannelBtn.click()
      }
    }
  }

  function resetChannelItemStyles() {
    const channelItems = fcDoc.querySelectorAll('.channelItem')
    channelItems.forEach(function (c) {
      c.style.borderColor = ''
    })

    const searchIcon = fcDoc.querySelector('.searchIcon')
    searchIcon.style.fill = ''
  }

  function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '')
      .replace(/../g, (color) =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount))
          .toString(16))
        .substr(-2))
  }

  function defocusActiveChannel() {
    const activeChannel = fcDoc.querySelector('.channelsList .active')
    if (!activeChannel) {
      return
    }
    const accentColor = appStyle.getPropertyValue('--accentColor')
    const searchIcon = activeChannel.querySelector('.searchIcon')

    if (searchIcon) {
      searchIcon.style.fill = adjustColor(accentColor, -80)
    } else {
      activeChannel.style.borderColor = adjustColor(accentColor, -200)
    }
  }

  function deselectSearchEntry(searchEntry) {
    if (!searchEntry) {
      return
    }

    searchEntry.style.borderColor = ''
    searchEntry.style.borderStyle = ''
    searchEntry.classList.remove('selected')

    if (searchEntry.parentElement._prevClass === 'welcomeListGrid' ||
      searchEntry.parentElement._prevClass === 'welcomeListGridBig') {
      searchEntry.parentElement.style.gridAutoRows = '0'
    }
  }

  function selectSearchEntry(searchEntry) {
    if (!searchEntry) {
      return
    }

    const navButtonSelected = fcDoc.querySelector('.searchResultsWrapper .button-alt.selected')
    if (navButtonSelected) {
      deselectSearchEntry(navButtonSelected)
    }

    defocusActiveChannel()

    let textFilter = fcDoc.querySelector('.welcomeWrapper .text-filter')
    if (searchEntry.parentElement._prevClass === 'searchResultsGrid') {
      textFilter = fcDoc.querySelector('.searchWrapper .text-filter')
    }
    textFilter.blur()

    const accentColor = appStyle.getPropertyValue('--accentColor')
    searchEntry.style.borderColor = accentColor
    searchEntry.style.borderStyle = 'solid'
    searchEntry.classList.add('selected')

    if (searchEntry.parentElement._prevClass === 'welcomeListGrid') {
      searchEntry.parentElement.style.gridAutoRows = 'auto'
    }

    if (searchEntry.parentElement._prevClass === 'welcomeListGridBig') {
      searchEntry.parentElement.style.gridAutoRows = 'unset'
    }

    searchEntry.scrollIntoViewIfNeeded()
  }

  function toggleSelectedSearchEntry() {
    let searchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper.selected')
    if (fcDoc.querySelector('.welcomeWrapper')
      .style.display === 'none') {
      searchEntry = fcDoc.querySelector(
        '.searchResultsGrid .channelWrapper.selected, .searchResultsWrapper .button-alt.selected:not(.disabled)'
      )
    }

    if (!searchEntry) {
      return false
    }

    const joinBtn = searchEntry.querySelector('.joinButton')
    if (joinBtn) {
      joinBtn.click()
      return true
    }

    const browseBtn = searchEntry.querySelector('.browseButton')
    if (browseBtn) {
      browseBtn.click()
      return true
    }

    deselectSearchEntry(searchEntry)
    searchEntry.click()
    return true
  }

  function prevSearchEntry() {
    if (fcDoc.querySelector('.welcomeWrapper')
      .style.display === 'none') {
      // search results
      const currentSearchEntry = fcDoc.querySelector(
        '.searchResultsGrid .channelWrapper.selected, .searchResultsWrapper .button-alt.selected:not(.disabled)'
      )
      let targetSearchEntry = fcDoc.querySelector('.searchResultsWrapper .searchResultsGrid .channelWrapper')
      if (currentSearchEntry) {
        deselectSearchEntry(currentSearchEntry)

        const searchEntries = fcDoc.querySelectorAll(
          '.searchResultsGrid .channelWrapper, .searchResultsWrapper .button-alt:not(.disabled)'
        )
        let prevEntryIndex = [...searchEntries].indexOf(currentSearchEntry) - 1
        if (prevEntryIndex < 0) {
          prevEntryIndex = searchEntries.length - 1
        }
        if (searchEntries[prevEntryIndex]) {
          targetSearchEntry = searchEntries[prevEntryIndex]
        }
      }

      selectSearchEntry(targetSearchEntry)
    } else {
      // welcome screen
      const currentSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper.selected')
      let targetSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper')
      if (currentSearchEntry) {
        deselectSearchEntry(currentSearchEntry)

        const searchEntries = fcDoc.querySelectorAll('.contentWrapper .gridWrapper')
        let prevEntryIndex = [...searchEntries].indexOf(currentSearchEntry) - 1
        if (prevEntryIndex < 0) {
          prevEntryIndex = searchEntries.length - 1
        }
        if (searchEntries[prevEntryIndex]) {
          targetSearchEntry = searchEntries[prevEntryIndex]
        }
      }

      selectSearchEntry(targetSearchEntry)
    }
  }

  function nextSearchEntry() {
    if (fcDoc.querySelector('.welcomeWrapper')
      .style.display === 'none') {
      // search results
      const currentSearchEntry = fcDoc.querySelector(
        '.searchResultsGrid .channelWrapper.selected, .searchResultsWrapper .button-alt.selected:not(.disabled)'
      )
      let targetSearchEntry = fcDoc.querySelector('.searchResultsWrapper .searchResultsGrid .channelWrapper')
      if (currentSearchEntry) {
        deselectSearchEntry(currentSearchEntry)

        const searchEntries = fcDoc.querySelectorAll(
          '.searchResultsGrid .channelWrapper, .searchResultsWrapper .button-alt:not(.disabled)'
        )
        let nextEntryIndex = [...searchEntries].indexOf(currentSearchEntry) + 1
        if (nextEntryIndex > searchEntries.length - 1) {
          nextEntryIndex = 0
        }
        if (searchEntries[nextEntryIndex]) {
          targetSearchEntry = searchEntries[nextEntryIndex]
        }
      }

      selectSearchEntry(targetSearchEntry)
    } else {
      // welcome screen
      const currentSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper.selected')

      let targetSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper')
      if (currentSearchEntry) {
        deselectSearchEntry(currentSearchEntry)

        const searchEntries = fcDoc.querySelectorAll('.contentWrapper .gridWrapper')
        let nextEntryIndex = [...searchEntries].indexOf(currentSearchEntry) + 1
        if (nextEntryIndex > searchEntries.length - 1) {
          nextEntryIndex = 0
        }
        if (searchEntries[nextEntryIndex]) {
          targetSearchEntry = searchEntries[nextEntryIndex]
        }
      }

      selectSearchEntry(targetSearchEntry)
    }
  }

  function prevWelcomeCategory() {
    const welcomeCategories = fcDoc.querySelectorAll('.welcomeListGrid, .welcomeListGridBig')
    const currentSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper.selected')
    let targetSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper')
    if (currentSearchEntry) {
      deselectSearchEntry(currentSearchEntry)

      let prevCatIndex = [...welcomeCategories].indexOf(currentSearchEntry.closest(
        '.welcomeListGrid, .welcomeListGridBig')) - 1
      if (prevCatIndex < 0) {
        prevCatIndex = welcomeCategories.length - 1
      }
      if (welcomeCategories[prevCatIndex]) {
        targetSearchEntry = welcomeCategories[prevCatIndex].querySelector('.gridWrapper')
      }
    }

    selectSearchEntry(targetSearchEntry)
  }

  function nextWelcomeCategory() {
    const welcomeCategories = fcDoc.querySelectorAll('.welcomeListGrid, .welcomeListGridBig')
    const currentSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper.selected')
    let targetSearchEntry = fcDoc.querySelector('.contentWrapper .gridWrapper')
    if (currentSearchEntry) {
      deselectSearchEntry(currentSearchEntry)

      let nextCatIndex = [...welcomeCategories].indexOf(currentSearchEntry.closest(
        '.welcomeListGrid, .welcomeListGridBig')) + 1
      if (nextCatIndex > welcomeCategories.length - 1) {
        nextCatIndex = 0
      }
      if (welcomeCategories[nextCatIndex]) {
        targetSearchEntry = welcomeCategories[nextCatIndex].querySelector('.gridWrapper')
      }
    }

    selectSearchEntry(targetSearchEntry)
  }

  function prevSearchRow() {
    const searchResultsActive = fcDoc.querySelector('.searchWrapper')
      .style.display === ''

    if (searchResultsActive) {
      const grid = Array.from(fcDoc.querySelectorAll('.searchResultsGrid .channelWrapper'))
      const baseOffset = grid[0].offsetTop
      const breakIndex = grid.findIndex(item => item.offsetTop > baseOffset)
      const numPerRow = (breakIndex === -1 ? grid.length : breakIndex)

      const navButtonSelected = fcDoc.querySelector('.searchResultsWrapper .button-alt.selected')

      const currentSearchEntry = fcDoc.querySelector('.searchResultsGrid .channelWrapper.selected')
      let targetSearchEntry = fcDoc.querySelector('.searchResultsGrid .contentWrapper')
      if (currentSearchEntry) {
        deselectSearchEntry(currentSearchEntry)

        const searchEntries = fcDoc.querySelectorAll(
          '.searchResultsGrid .channelWrapper, .searchResultsWrapper .button-alt:not(.disabled)'
        )
        let searchEntryIndex = [...searchEntries].indexOf(currentSearchEntry)
        let prevRowEntryIndex = searchEntryIndex - numPerRow
        if (prevRowEntryIndex < 0) {
          prevRowEntryIndex = searchEntryIndex
        }
        if (searchEntries[prevRowEntryIndex]) {
          targetSearchEntry = searchEntries[prevRowEntryIndex]
        }
      } else if (navButtonSelected) {
        deselectSearchEntry(navButtonSelected)
        const searchEntries = fcDoc.querySelectorAll(
          '.searchResultsGrid .channelWrapper'
        )
        targetSearchEntry = searchEntries[searchEntries.length - 1]
      }

      selectSearchEntry(targetSearchEntry)
    }
  }

  function nextSearchRow() {
    const searchResultsActive = fcDoc.querySelector('.searchWrapper')
      .style.display === ''

    if (searchResultsActive) {
      const grid = Array.from(fcDoc.querySelectorAll('.searchResultsGrid .channelWrapper'))
      const baseOffset = grid[0].offsetTop
      const breakIndex = grid.findIndex(item => item.offsetTop > baseOffset)
      const numPerRow = (breakIndex === -1 ? grid.length : breakIndex)

      const currentSearchEntry = fcDoc.querySelector('.searchResultsGrid .channelWrapper.selected')
      let targetSearchEntry = fcDoc.querySelector('.searchResultsGrid .channelWrapper')
      if (currentSearchEntry) {
        deselectSearchEntry(currentSearchEntry)

        const searchEntries = fcDoc.querySelectorAll(
          '.searchResultsGrid .channelWrapper, .searchResultsWrapper .button-alt:not(.disabled)'
        )
        let searchEntryIndex = [...searchEntries].indexOf(currentSearchEntry)
        let nextRowEntryIndex = searchEntryIndex + numPerRow
        if (nextRowEntryIndex > searchEntries.length - 1) {
          nextRowEntryIndex = searchEntryIndex
        }
        if (searchEntries[nextRowEntryIndex]) {
          targetSearchEntry = searchEntries[nextRowEntryIndex]
        }
      }

      selectSearchEntry(targetSearchEntry)
    }
  }

  // usersOnlineList
  function deselectUser(user) {
    user.style.backgroundColor = ''
    user.classList.remove('selected')
  }

  function selectUser(user) {
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

  function selectPrevUser() {
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

  function selectNextUser() {
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

  function focusSelectedUser() {
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

  function defocusSelectedUser() {
    const unfocusedSelectColor = appStyle.getPropertyValue('--mainColor-darker-trans-hi')
    const currentUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')
    if (currentUser) {
      currentUser.style.backgroundColor = unfocusedSelectColor
    }
  }

  function toggleSelectedUser() {
    const selectedUser = fcDoc.querySelector('.channelWrapper.selected .usersOnlineList .userItem.selected')
    if (selectedUser) {
      selectedUser.click()
      selectedUser.click()
    }
  }

  // matchList
  function deselectMatch(match) {
    match.style.backgroundColor = ''
    match.classList.remove('selected')
  }

  function selectMatch(match) {
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

  function selectPrevMatch() {
    const currentMatch = fcDoc.querySelector(
      '.channelWrapper.selected .usersListToolbar .matchesList .matchItem.selected'
    )

    let targetMatch = fcDoc.querySelector('.channelWrapper.selected .usersListToolbar .matchesList .matchItem')

    if (currentMatch) {
      const matches = fcDoc.querySelectorAll(
        '.channelWrapper.selected .usersListToolbar .matchesList .matchItem')
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

  function selectNextMatch() {
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

  function focusSelectedMatch() {
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

  function defocusSelectedMatch() {
    const unfocusedSelectColor = appStyle.getPropertyValue('--mainColor-darker-trans-hi')
    const currentMatch = fcDoc.querySelector(
      '.channelWrapper.selected .usersListToolbar .matchesList .matchItem.selected'
    )
    if (currentMatch) {
      currentMatch.style.backgroundColor = unfocusedSelectColor
    }
  }

  function toggleSelectedMatch() {
    const selectedMatch = fcDoc.querySelector('.channelWrapper.selected .matchesList .matchItem.selected')
    selectedMatch.click()
    selectedMatch.click()
  }

  function reconcileClickedChannels() {
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

  function refreshColumns() {
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

  function silentNotify(msg) {
    currentNotification = new fcWindow.Notification(msg, {
      silent: true
    })
  }

  function changeColumnAction(notify = true) {
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

  function prevColumn() {
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

  function nextColumn() {
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

  function prevElement() {
    refreshColumns()
    if (currentColumn === 'channels') {
      togglePrevChannel()
    } else if (currentColumn === 'usersOnlineList') {
      selectPrevUser()
    } else if (currentColumn === 'matchesList') {
      selectPrevMatch()
    }
  }

  function nextElement() {
    refreshColumns()
    if (currentColumn === 'channels') {
      toggleNextChannel()
    } else if (currentColumn === 'usersOnlineList') {
      selectNextUser()
    } else if (currentColumn === 'matchesList') {
      selectNextMatch()
    }
  }

  function toggleAction(condition) {
    if (!condition) {
      return
    }

    const pendingChallenges = fcDoc.querySelectorAll(
      '.messageWrapper.challengeRequested .message .challengeContent .accept-challenge'
    )

    const userStateMenuActive = fcDoc.querySelector('.userStateMenu.active')

    if (userStateMenuActive) {
      toggleSelectedUserState()
    } else if (pendingChallenges.length > 0) {
      const lastChallenge = [...pendingChallenges].slice(-1)[0]
      lastChallenge.click()
    } else {
      const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc
        .querySelector('.searchWrapper')
        .style.display === ''

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
      } else if (searchActive) {
        if (!toggleSelectedSearchEntry()) {
          nextSearchEntry()
        }
      }
    }
  }

  function cancelAction(condition) {
    if (!condition) {
      return
    }

    const pendingChallenges = fcDoc.querySelectorAll(
      '.messageWrapper.requestChallenge .cancel-challenge, .messageWrapper.challengeRequested .decline-challenge'
    )
    const userStateMenuActive = fcDoc.querySelector('.userStateMenu.active')

    if (userStateMenuActive) {
      toggleUserStateMenu()
    } else if (pendingChallenges.length > 0) {
      const denyLastChallengeRequest = [...pendingChallenges].slice(-1)[0]
      denyLastChallengeRequest.click()
    } else if (currentColumn === 'channels') {
      leaveChannel()
    }
  }

  function toggleSearch() {
    const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc.querySelector(
        '.searchWrapper')
      .style.display === ''
    const openChannels = fcDoc.querySelectorAll('.channelsList .channelItemWrapper')

    if (searchActive) {
      if (openChannels.length > 0) {
        toggleNextChannel()
        silentNotify('Switch Lobbies')
      } else {
        leaveChannel()
      }
    } else {
      const searchButton = fcDoc.querySelector('.channelsList .buttonItemWrapper')
      searchButton.click()
      silentNotify('Browse Games')
    }
  }

  function toggleUserStateMenu() {
    deselectUserState()
    selfUserAvatar = fcDoc.querySelector('.userButton .userAvatar')
    selfUserAvatar.click()
  }

  function deselectUserState() {
    const selectedUserState = fcDoc.querySelector('.userStateMenu .optionWrapper.selected')
    if (!selectedUserState) {
      return
    }

    selectedUserState.style.borderColor = ''
    selectedUserState.style.borderStyle = ''
    selectedUserState.classList.remove('selected')
  }

  function toggleSelectedUserState() {
    const selectedUserState = fcDoc.querySelector('.userStateMenu .optionWrapper.selected')
    if (!selectedUserState) {
      return
    }

    deselectUserState()

    userStateButton = selectedUserState.querySelector('.stateShape')
    userStateButton.click()
  }

  function selectUserState(userState) {
    if (!userState) {
      return
    }

    deselectUserState()

    userState.classList.add('selected')
    const accentColor = appStyle.getPropertyValue('--accentColor')
    userState.style.borderColor = accentColor
    userState.style.borderStyle = 'solid'
  }

  function selectPrevUserState() {
    const userStates = fcDoc.querySelectorAll('.userStateMenu .optionWrapper')
    if (userStates.length == 0) {
      return
    }

    let selectedUserState = fcDoc.querySelector('.userStateMenu .optionWrapper.selected')

    if (!selectedUserState) {
      const lastUserState = userStates[userStates.length - 1]
      selectUserState(lastUserState)
      return
    }

    let prevUserStateIndex = -1

    prevUserStateIndex = [...userStates].indexOf(selectedUserState) - 1
    if (prevUserStateIndex < 0) {
      prevUserStateIndex = userStates.length - 1
    }
    selectedUserState = userStates[prevUserStateIndex]

    selectUserState(userStates[prevUserStateIndex])
  }

  function selectNextUserState() {
    const userStates = fcDoc.querySelectorAll('.userStateMenu .optionWrapper')
    if (userStates.length == 0) {
      return
    }

    let selectedUserState = fcDoc.querySelector('.userStateMenu .optionWrapper.selected')

    if (!selectedUserState) {
      const firstUserState = userStates[0]
      selectUserState(firstUserState)
      return
    }

    let nextUserStateIndex = 0

    nextUserStateIndex = [...userStates].indexOf(selectedUserState) + 1
    if (nextUserStateIndex > userStates.length - 1) {
      nextUserStateIndex = 0
    }

    selectUserState(userStates[nextUserStateIndex])
  }

  function spectateRandomMatch() {
    const matches = fcDoc.querySelectorAll('.channelWrapper.selected .matchesList .matchItem')
    const randomIndex = Math.floor(Math.random() * matches.length)
    if (matches[randomIndex]) {
      matches[randomIndex].click()
      matches[randomIndex].click()
    }
  }

  function upAction(condition = true) {
    const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc.querySelector(
        '.searchWrapper')
      .style.display === ''
    const searchResultsActive = fcDoc.querySelector('.searchWrapper')
      .style.display === ''
    const userStateMenuActive = fcDoc.querySelector('.userStateMenu.active')

    if (userStateMenuActive) {
      if (condition) {
        selectPrevUserState()
      }
    } else if (searchResultsActive) {
      prevSearchRow()
    } else if (searchActive) {
      if (condition) {
        prevWelcomeCategory()
      }
    } else {
      if (condition || scrollableColumns.includes(currentColumn)) {
        prevElement()
      }
    }
  }

  function downAction(condition = true) {
    const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc.querySelector(
        '.searchWrapper')
      .style.display === ''
    const searchResultsActive = fcDoc.querySelector('.searchWrapper')
      .style.display === ''
    const userStateMenuActive = fcDoc.querySelector('.userStateMenu.active')

    if (userStateMenuActive) {
      if (condition) {
        selectNextUserState()
      }
    } else if (searchResultsActive) {
      nextSearchRow()
    } else if (searchActive) {
      if (condition) {
        nextWelcomeCategory()
      }
    } else {
      if (condition || scrollableColumns.includes(currentColumn)) {
        nextElement()
      }
    }
  }

  function leftAction(condition = true) {
    const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc.querySelector(
        '.searchWrapper')
      .style.display === ''
    const userStateMenuActive = fcDoc.querySelector('.userStateMenu.active')

    if (userStateMenuActive) {
    } else if (condition || searchActive) {
      if (searchActive) {
        prevSearchEntry()
      } else {
        prevColumn()
      }
    }
  }

  function rightAction(condition = true) {
    const searchActive = fcDoc.querySelector('.channelsList .buttonItemWrapper.active') || fcDoc.querySelector(
        '.searchWrapper')
      .style.display === ''
    const userStateMenuActive = fcDoc.querySelector('.userStateMenu.active')

    if (userStateMenuActive) {
    } else if (condition || searchActive) {
      if (searchActive) {
        nextSearchEntry()
      } else {
        nextColumn()
      }
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
  allKeys.set('a', 'Numpad0')
  allKeys.set('b', 'NumpadDecimal')
  allKeys.set('x', 'Numpad7')
  allKeys.set('y', 'Numpad9')
  allKeys.set('lb', 'NumpadDivide')
  allKeys.set('rb', 'NumpadMultiply')

  allKeys.set('spectateRandomMatch', 'F6')

  const keyHeld = new Map()
  for (const val of allKeys.values()) {
    keyHeld.set(val, false)
  }

  fcDoc.addEventListener('keydown', actKey)

  function actKey(e) {
    if (!fcDoc.hasFocus()) {
      return
    }

    reconcileClickedChannels()

    if (!e.getModifierState('NumLock')) {
      if (Array.from(allKeys.values()).includes(e.code)) {
        e.preventDefault()
      }
      switch (e.code) {
      case allKeys.get('up'):
        upAction(!keyHeld.get(e.code))
        break
      case allKeys.get('down'):
        downAction(!keyHeld.get(e.code))
        break
      case allKeys.get('left'):
        leftAction(!keyHeld.get(e.code))
        break
      case allKeys.get('right'):
        rightAction(!keyHeld.get(e.code))
        break
      case allKeys.get('a'):
        toggleAction(!keyHeld.get(e.code))
        break
      case allKeys.get('b'):
        cancelAction(!keyHeld.get(e.code))
        break
      case allKeys.get('x'):
        if (!keyHeld.get(e.code)) {
          toggleUserStateMenu()
        }
        break
      case allKeys.get('y'):
        if (!keyHeld.get(e.code)) {
          toggleSearch()
        }
        break
      case allKeys.get('lb'):
        if (!keyHeld.get(e.code)) {
          togglePrevChannel()
        }
        break
      case allKeys.get('rb'):
        if (!keyHeld.get(e.code)) {
          toggleNextChannel()
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
  allBtns.set('a', 0)
  allBtns.set('b', 1)
  allBtns.set('x', 2)
  allBtns.set('y', 3)
  allBtns.set('lb', 4)
  allBtns.set('rb', 5)

  function applyCustomControllerProfiles(gamepad) {
    if (gamepad.id === 'Astro city mini Arcade stick (Vendor: 0ca3 Product: 0028)') {
      allBtns.set('a', 2)
      allBtns.set('b', 1)
      allBtns.set('x', 3)
      allBtns.set('y', 0)
      allBtns.set('lb', 4)
      allBtns.set('rb', 5)
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
          btnHeld.get(e.gamepad.index)
            .set(btn, false)
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
              upAction(!btnHeld.get(gp.index)[b])
              break
            case allBtns.get('down'):
              downAction(!btnHeld.get(gp.index)[b])
              break
            case allBtns.get('lb'):
              if (!btnHeld.get(gp.index)[b]) {
                togglePrevChannel()
              }
              break
            case allBtns.get('rb'):
              if (!btnHeld.get(gp.index)[b]) {
                toggleNextChannel()
              }
              break
            case allBtns.get('x'):
              if (!btnHeld.get(gp.index)[b]) {
                toggleUserStateMenu()
              }
              break
            case allBtns.get('y'):
              if (!btnHeld.get(gp.index)[b]) {
                toggleSearch()
              }
              break
            case allBtns.get('left'):
              leftAction(!btnHeld.get(gp.index)[b])
              break
            case allBtns.get('right'):
              rightAction(!btnHeld.get(gp.index)[b])
              break
            case allBtns.get('a'):
              toggleAction(!btnHeld.get(gp.index)[b])
              break
            case allBtns.get('b'):
              cancelAction(!btnHeld.get(gp.index)[b])
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
            if (a === 0) {
              if (axisVal < -axisThreshold) {
                leftAction(neutralX.get(gp.index))
              } else if (axisVal > axisThreshold) {
                rightAction(neutralX.get(gp.index))
              }
              neutralX.set(gp.index, false)
            }
            // y axis
            if (a === 1) {
              if (axisVal < -axisThreshold) {
                upAction(neutralY.get(gp.index))
              } else if (axisVal > axisThreshold) {
                downAction(neutralY.get(gp.index))
              }
              neutralY.set(gp.index, false)
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
