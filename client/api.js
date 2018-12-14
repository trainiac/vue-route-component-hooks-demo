const users = [
  {
    userId: '1',
    name: 'The Dude',
    image: '',
  },
  {
    userId: '2',
    name: 'Walter Sobchak',
    image: '',
  },
  {
    userId: '3',
    name: 'Donny',
    image: '',
  },
]

const publicProfile = {
  '1': true,
  '3': true,
}

const interests = {
  '1': ['Bowling', 'Milk', 'Rug'],
  '2': ['Bowling', 'Dogs', 'Toes'],
  '3': ['Bowling', 'Surfing'],
}

const ONE_SECOND = 1000
const TWO_SECONDS = 2000
const THREE_SECONDS = 3000
const FOUR_SECONDS = 4000

export default {
  isAuthenticated() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, ONE_SECOND)
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  isPublic(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(publicProfile[userId])
      }, ONE_SECOND)
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  fetchUser(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(users.find(user => user.userId === userId))
      }, THREE_SECONDS)
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  fetchAllUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(users)
      }, THREE_SECONDS)
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  fetchUserInterests(userId) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(interests[userId])
      }, FOUR_SECONDS)
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
  fetchFriends(contextUserId) {
    return new Promise(resolve => {
      setTimeout(() => {
        const friends = users.filter(user => user.userId !== contextUserId)
        resolve(friends)
      }, TWO_SECONDS)
    })
      .then(data => {
        return data
      })
      .catch(err => {
        return Promise.reject(err)
      })
  },
}
