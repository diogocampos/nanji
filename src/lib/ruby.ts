interface RubyAtom {
  readonly base: string // main content
  readonly text: string // annotation
}

class Ruby {
  private readonly _atoms: readonly RubyAtom[]

  constructor(atoms: readonly RubyAtom[]) {
    const _atoms = []

    for (let i = 0, len = atoms.length; i < len; ++i) {
      let atom = atoms[i]
      while (!atom.text && i + 1 < len) {
        const next = atoms[++i]
        atom = { base: atom.base + next.base, text: next.text }
      }
      _atoms.push(atom)
    }

    this._atoms = _atoms
  }

  get length(): number {
    return this._atoms.length
  }

  map<T>(callback: (value: RubyAtom, index: number) => T): T[] {
    return this._atoms.map(callback)
  }

  toString(): string {
    return this._atoms.reduce((string, atom) => string + atom.base, '')
  }

  toDebugString(): string {
    const bases = this._atoms.map((atom) => atom.base).join(' / ')
    const texts = this._atoms.map((atom) => atom.text).join(' / ')
    return `${bases} -> ${texts}`
  }
}

type IRuby = InstanceType<typeof Ruby>
export default IRuby

export function r(base: string, text: string): Ruby {
  return new Ruby([{ base, text }])
}

export function R(...rubies: readonly Ruby[]): Ruby {
  let atoms: RubyAtom[] = []
  for (const ruby of rubies) {
    atoms = atoms.concat(ruby['_atoms'])
  }
  return new Ruby(atoms)
}
