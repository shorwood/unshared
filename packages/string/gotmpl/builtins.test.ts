import { BUILTINS } from './builtins'
import { GoTmpl } from './types'
import { valueFromJS } from './value'

function nil(): GoTmpl.Value.Nil {
  return { kind: GoTmpl.Value.Kind.Nil }
}

function number(value: unknown): GoTmpl.Value.Number {
  return { kind: GoTmpl.Value.Kind.Number, value: Number(value) }
}

function string(value: string): GoTmpl.Value.String {
  return { kind: GoTmpl.Value.Kind.String, value }
}

function bool(value: boolean): GoTmpl.Value.Bool {
  return { kind: GoTmpl.Value.Kind.Bool, value }
}

describe('builtins', () => {
  describe('len', () => {
    it('returns length of string', () => {
      const result = BUILTINS.len(string('hello'))
      expect(result).toEqual(number(5))
    })

    it('returns length of array', () => {
      const result = BUILTINS.len({
        kind: GoTmpl.Value.Kind.Array,
        value: [string('a'), number(2), bool(true)],
      })
      expect(result).toEqual(number(3))
    })

    it('returns length of object', () => {
      const result = BUILTINS.len({
        kind: GoTmpl.Value.Kind.Object,
        raw: { key1: 'value1', key2: 42 },
        value: { key1: string('value1'), key2: number(42) },
      })
      expect(result).toEqual(number(2))
    })

    it('should throw error for unsupported type', () => {
      const shouldThrow = () => BUILTINS.len(bool(true))
      expect(shouldThrow).toThrow('len: unsupported type "true"')
    })
  })

  describe('eq', () => {
    describe('bool equality', () => {
      it('returns true for 2 equal bools', () => {
        const result = BUILTINS.eq(bool(true), bool(true))
        expect(result).toEqual(bool(true))
      })

      it('returns true for 3 equal bools', () => {
        const result = BUILTINS.eq(bool(true), bool(true), bool(true))
        expect(result).toEqual(bool(true))
      })

      it('returns false for 2 equal and 1 unequal bools', () => {
        const result = BUILTINS.eq(bool(true), bool(true), bool(false))
        expect(result).toEqual(bool(false))
      })
    })

    describe('string equality', () => {
      it('returns true for 2 equal strings', () => {
        const result = BUILTINS.eq(string('test'), string('test'))
        expect(result).toEqual(bool(true))
      })

      it('returns true for 3 equal strings', () => {
        const result = BUILTINS.eq(string('test'), string('test'), string('test'))
        expect(result).toEqual(bool(true))
      })

      it('returns false for 2 equal and 1 unequal strings', () => {
        const result = BUILTINS.eq(string('test'), string('test'), string('different'))
        expect(result).toEqual(bool(false))
      })
    })

    describe('number equality', () => {
      it('returns true for 2 equal numbers', () => {
        const result = BUILTINS.eq(number(42), number(42) )
        expect(result).toEqual(bool(true))
      })

      it('returns true for 3 equal numbers', () => {
        const result = BUILTINS.eq(number(42), number(42), number(42) )
        expect(result).toEqual(bool(true))
      })

      it('returns false for 2 equal and 1 unequal numbers', () => {
        const result = BUILTINS.eq(number(42), number(42), number(7) )
        expect(result).toEqual(bool(false))
      })
    })

    describe('mixed type equality', () => {
      it('returns false for bool and string', () => {
        const result = BUILTINS.eq(bool(true), string('true') )
        expect(result).toEqual(bool(false))
      })
    })

    describe('nil equality', () => {
      it('returns true for two nils', () => {
        const result = BUILTINS.eq(nil(), nil())
        expect(result).toEqual(bool(true))
      })

      it('returns false for nil and non-nil', () => {
        const result = BUILTINS.eq(nil(), string('not nil'))
        expect(result).toEqual(bool(false))
      })
    })

    describe('error handling', () => {
      it('throws error when no arguments are provided', () => {
        const shouldThrow = () => BUILTINS.eq()
        expect(shouldThrow).toThrow('eq: need at least two arguments')
      })

      it('throws error when only one argument is provided', () => {
        const shouldThrow = () => BUILTINS.eq(string('only one'))
        expect(shouldThrow).toThrow('eq: need at least two arguments')
      })
    })
  })

  describe('ne', () => {
    describe('bool inequality', () => {
      it('returns false for 2 equal bools', () => {
        const result = BUILTINS.ne(bool(true), bool(true))
        expect(result).toEqual(bool(false))
      })
    })

    describe('string inequality', () => {
      it('returns false for 2 equal strings', () => {
        const result = BUILTINS.ne(string('test'), string('test'))
        expect(result).toEqual(bool(false))
      })

      it('returns true for 2 unequal strings', () => {
        const result = BUILTINS.ne(string('test'), string('different'))
        expect(result).toEqual(bool(true))
      })
    })

    describe('number inequality', () => {
      it('returns false for 2 equal numbers', () => {
        const result = BUILTINS.ne(number(42), number(42))
        expect(result).toEqual(bool(false))
      })

      it('returns true for 2 unequal numbers', () => {
        const result = BUILTINS.ne(number(42), number(7))
        expect(result).toEqual(bool(true))
      })
    })

    describe('mixed type inequality', () => {
      it('returns true for bool and string', () => {
        const result = BUILTINS.ne(bool(true), string('true'))
        expect(result).toEqual(bool(true))
      })
    })

    describe('nil inequality', () => {
      it('returns false for two nils', () => {
        const result = BUILTINS.ne(nil(), nil())
        expect(result).toEqual(bool(false))
      })

      it('returns true for nil and non-nil', () => {
        const result = BUILTINS.ne(nil(), string('not nil'))
        expect(result).toEqual(bool(true))
      })
    })

    describe('error handling', () => {
      it('throws error when no arguments are provided', () => {
        const shouldThrow = () => BUILTINS.ne()
        expect(shouldThrow).toThrow('ne: need at least two arguments')
      })

      it('throws error when only one argument is provided', () => {
        const shouldThrow = () => BUILTINS.ne(string('only one'))
        expect(shouldThrow).toThrow('ne: need at least two arguments')
      })
    })
  })

  describe('lt', () => {
    it('should return true for lesser numbers', () => {
      const result = BUILTINS.lt(number(3), number(5))
      expect(result).toEqual(bool(true))
    })

    it('should return false for greater numbers', () => {
      const result = BUILTINS.lt(number(7), number(2))
      expect(result).toEqual(bool(false))
    })

    it('should return false for equal numbers', () => {
      const result = BUILTINS.lt(number(4), number(4))
      expect(result).toEqual(bool(false))
    })

    it('should throw error for non-number arguments', () => {
      const shouldThrow = () => BUILTINS.lt(string('a'), string('b'))
      expect(shouldThrow).toThrow('lt: operands must be numbers')
    })
  })

  describe('gt', () => {
    it('should return true for greater numbers', () => {
      const result = BUILTINS.gt(number(10), number(4))
      expect(result).toEqual(bool(true))
    })

    it('should return false for lesser numbers', () => {
      const result = BUILTINS.gt(number(1), number(6))
      expect(result).toEqual(bool(false))
    })

    it('should return false for equal numbers', () => {
      const result = BUILTINS.gt(number(5), number(5))
      expect(result).toEqual(bool(false))
    })

    it('should throw error for non-number arguments', () => {
      const shouldThrow = () => BUILTINS.gt(string('a'), string('b'))
      expect(shouldThrow).toThrow('gt: operands must be numbers')
    })
  })

  describe('ge', () => {
    it('should return true for greater numbers', () => {
      const result = BUILTINS.ge(number(8), number(3))
      expect(result).toEqual(bool(true))
    })

    it('should return true for equal numbers', () => {
      const result = BUILTINS.ge(number(5), number(5))
      expect(result).toEqual(bool(true))
    })

    it('should return false for lesser numbers', () => {
      const result = BUILTINS.ge(number(2), number(7))
      expect(result).toEqual(bool(false))
    })

    it('should throw error for non-number arguments', () => {
      const shouldThrow = () => BUILTINS.ge(string('a'), string('b'))
      expect(shouldThrow).toThrow('ge: operands must be numbers')
    })
  })

  describe('le', () => {
    it('should return true for lesser numbers', () => {
      const result = BUILTINS.le(number(3), number(6))
      expect(result).toEqual(bool(true))
    })

    it('should return true for equal numbers', () => {
      const result = BUILTINS.le(number(4), number(4))
      expect(result).toEqual(bool(true))
    })

    it('should return false for greater numbers', () => {
      const result = BUILTINS.le(number(9), number(2))
      expect(result).toEqual(bool(false))
    })

    it('should throw error for non-number arguments', () => {
      const shouldThrow = () => BUILTINS.le(string('a'), string('b'))
      expect(shouldThrow).toThrow('le: operands must be numbers')
    })
  })

  describe('and', () => {
    it('should return true if all arguments are true', () => {
      const result = BUILTINS.and(bool(true), bool(true), bool(true))
      expect(result).toEqual(bool(true))
    })

    it('should return false if any argument is false', () => {
      const result = BUILTINS.and(bool(true), bool(true), bool(false))
      expect(result).toEqual(bool(false))
    })

    it('should return false if all arguments are false', () => {
      const result = BUILTINS.and(bool(false), bool(false))
      expect(result).toEqual(bool(false))
    })

    it('should cast non-bool arguments to bool', () => {
      const result = BUILTINS.and(string('some string'), number(1), bool(true))
      expect(result).toEqual(bool(true))
    })
  })

  describe('or', () => {
    it('should return true if any argument is true', () => {
      const result = BUILTINS.or(bool(false), bool(true), bool(false))
      expect(result).toEqual(bool(true))
    })

    it('should return false if all arguments are false', () => {
      const result = BUILTINS.or(bool(false), bool(false))
      expect(result).toEqual(bool(false))
    })

    it('should cast non-bool arguments to bool', () => {
      const result = BUILTINS.or(string(''), number(0), bool(false), string('non-empty'))
      expect(result).toEqual(bool(true))
    })
  })

  describe('not', () => {
    it('should return false for true', () => {
      const result = BUILTINS.not(bool(true))
      expect(result).toEqual(bool(false))
    })

    it('should return true for false', () => {
      const result = BUILTINS.not(bool(false))
      expect(result).toEqual(bool(true))
    })

    it('should cast non-bool argument to bool', () => {
      const result = BUILTINS.not(string('non-empty'))
      expect(result).toEqual(bool(false))
    })
  })

  describe('print', () => {
    it('should concatenate string representations of all arguments', () => {
      const result = BUILTINS.print(string('Hello, '), number(42), bool(true))
      expect(result).toEqual(string('Hello, 42true'))
    })
  })

  describe('println', () => {
    it('should concatenate string representations of all arguments with newline', () => {
      const result = BUILTINS.println(string('Line 1'), string('Line 2'))
      expect(result).toEqual(string('Line 1Line 2\n'))
    })
  })

  describe('urlquery', () => {
    it('should return URL-encoded string', () => {
      const result = BUILTINS.urlquery(string('Hello World!'))
      expect(result).toEqual(string('Hello%20World!'))
    })
  })

  describe('index', () => {
    it('should return element at specified index in array', () => {
      const arrayValue: GoTmpl.Value.Array = {
        kind: GoTmpl.Value.Kind.Array,
        value: [string('a'), string('b'), string('c')],
      }
      const result = BUILTINS.index(arrayValue, number(1))
      expect(result).toEqual(string('b'))
    })

    it('should return undefined for out-of-bounds index', () => {
      const arrayValue = valueFromJS(['x', 'y', 'z']) as GoTmpl.Value.Array
      const result = BUILTINS.index(arrayValue, number(5))
      expect(result).toEqual(nil())
    })
  })

  describe('html', () => {
    it('should escape &, < and >', () => {
      const result = BUILTINS.html(string('&<>'))
      expect(result).toEqual(string('&amp;&lt;&gt;'))
    })
    it('should escape quotes', () => {
      const result = BUILTINS.html(string('\"\''))
      expect(result).toEqual(string('&quot;&#39;'))
    })
    it('should return same string when no escapable chars', () => {
      const original = 'plain'
      const result = BUILTINS.html(string(original))
      expect(result).toEqual(string(original))
    })
  })

  describe('call', () => {
    it('should invoke function with provided arguments', () => {
      const fnRaw = vi.fn((a: number, b: number) => a + b)
      const fn = valueFromJS(fnRaw) as GoTmpl.Value.Function
      BUILTINS.call(fn, number(3), number(4))
      expect(fnRaw).toHaveBeenCalledWith(3, 4)
    })

    it('should call and return result of function', () => {
      const fn = valueFromJS((a: string, b: string) => a + b) as GoTmpl.Value.Function
      const result = BUILTINS.call(fn, string('Hello, '), string('World!'))
      expect(result).toEqual(string('Hello, World!'))
    })

    it('should throw error if first argument is not a function', () => {
      const shouldThrow = () => BUILTINS.call(string('not a function'), string('arg1'))
      expect(shouldThrow).toThrow('call: first argument must be a function')
    })
  })

  describe('js', () => {
    it('should escape < > &', () => {
      const result = BUILTINS.js(string('<>&'))
      expect(result).toEqual(string(String.raw`\u003C\u003E\u0026`))
    })
  })

  describe('slice', () => {
    it('should slice array with start only', () => {
      const array = valueFromJS(['a', 'b', 'c', 'd']) as GoTmpl.Value.Array
      const result = BUILTINS.slice(array, number(2)) as GoTmpl.Value.Array
      expect(result.value.map(v => (v as GoTmpl.Value.String).value)).toEqual(['c', 'd'])
    })
    it('should slice array with start and end', () => {
      const array = valueFromJS(['a', 'b', 'c', 'd', 'e']) as GoTmpl.Value.Array
      const result = BUILTINS.slice(array, number(1), number(3)) as GoTmpl.Value.Array
      expect(result.value.map(v => (v as GoTmpl.Value.String).value)).toEqual(['b', 'c'])
    })
    it('should slice string', () => {
      const result = BUILTINS.slice(string('abcdef'), number(1), number(4)) as GoTmpl.Value.String
      expect(result).toEqual(string('bcd'))
    })
    it('should throw for out of range', () => {
      const array = valueFromJS(['x']) as GoTmpl.Value.Array
      const shouldThrow = () => BUILTINS.slice(array, number(0), number(5))
      expect(shouldThrow).toThrow('slice: index out of range')
    })
    it('should throw for unsupported type', () => {
      const shouldThrow = () => BUILTINS.slice(bool(true), number(0))
      expect(shouldThrow).toThrow('slice: unsupported type "true"')
    })
  })

  describe('printf', () => {
    it('should format basic verbs', () => {
      const result = BUILTINS.printf(string('int=%d float=%f bool=%t str=%s any=%v'), number(7), number(3.14), bool(false), string('hi'), number(9))
      expect(result).toEqual(string('int=7 float=3.14 bool=false str=hi any=9'))
    })
    it('should handle %% literal', () => {
      const result = BUILTINS.printf(string('100%% done'))
      expect(result).toEqual(string('100% done'))
    })
    it('should drop unmatched verbs when args missing', () => {
      const result = BUILTINS.printf(string('%d %d'), number(1))
      expect(result).toEqual(string('1 '))
    })
    it('should leave unsupported verb intact', () => {
      const result = BUILTINS.printf(string('hex=%x'), number(255))
      expect(result).toEqual(string('hex=%x'))
    })
  })
})
