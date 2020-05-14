/**
 * Map
 * 定义： 保存键值对的可迭代数据结构
 * 特性： 1.能够记住键值对的原始插入顺序
 *       2.任何值（包括对象和原始数据）都能作为键或者值
 *       3.在迭代时，会根据插入顺序进行一个一个遍历，并且返回[key, value]形式的数组
 */

/**
 * 对象版的 Imap
 * 不可迭代，无法记住键值对的顺序，无法根据参数初始化，滥竽充数（小声BB）
 */
let ObjMap = (function(){
  function Imap() {
    this.data = {}
    this.size = 0
  }
  
  Imap.prototype.get = function(key) {
    const value = this.data[key]
    console.log(`get ${key}:`,value)
    return value
  }
  
  Imap.prototype.set = function(key, value) {
    console.log(`set (${key}, ${value})`)
    if (!this.data.hasOwnProperty(key)) {
      this.size += 1
    }
    this.data[key] = value
    return this.data
  }
  
  Imap.prototype.clear = function() {
    console.log('clear map')
    this.data = {}
    this.size = 0
  }
  
  Imap.prototype.delete = function(key) {
    console.log(`delete ${key}`)
    if (!this.data.hasOwnProperty(key)) {
      return false
    } else {
      delete this.data[key]
      this.size -= 1
      return true
    }
  }
  return ObjMap
}())

/**
 * 数组版的
 * 根据特性1和特性3，可以考虑用数组来实现
 * 基本上满足了 map 的所有情况
 */

let ArrayMap = (function() {
  function amap (initalValue) {
    this.entries = []
    if (!Array.isArray(initalValue)) {
      throw new Error('param is not iterable')
    } else {
      for (let iterator of initalValue) {
        if (!Array.isArray(iterator)) {
          throw new Error(`${iterator} is not iterable`)
        }
        this.entries.push([iterator[0], iterator[1]])
      }
    }
  }

  amap.prototype.get = function(key) {
    for (let element of this.entries) {
      if (element[0] === key) {
        return element[1]
      }
    }
  }

  amap.prototype.set = function(key, value) {
    for (let element of this.entries) {
      if (element[0] === key) {
        element[1] = value
        return this.entries
      }
    }
    return this.entries.push([key, value])
  }

  amap.prototype.clear = function() {
    this.entries = []
  }

  amap.prototype.delete = function(key) {
    let index
    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i][0] === key) {
        index = i
        break
      }
    }

    if (index !== undefined) {
      this.entries.splice(index, 1)
      return true
    }
    return false
  }

  amap.prototype.forEach = function(cb) {
    for (let element of this.entries) {
      cb && cb(element[1], element[0], this)
    }
  }

  amap.prototype.keys = function() {
    let keys = []
    for (let element of this.entries) {
      keys.push(element[0])
    }
    return keys
  }

  amap.prototype.values = function() {
    let values = []
    for (let element of this.entries) {
      values.push(element[0])
    }
    return values
  }

  Object.defineProperty(amap.prototype, 'size', {
    get: function() {
      return this.entries.length
    },
    enumerable: true,
    configurable: true
  })
  return amap
}())

/**
 * 顺便看看es6
 */
class ClassMap {
  constructor() {
    this.entries = []
    this.size = 0
    this.__proto__.getEntry  = function(params) {
      // 就是方便理解继承链,其实挂在 this下和在 proto 下都一样，一样会被继承
    }
    // ...其余跟上面一致
  }
}


