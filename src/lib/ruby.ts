interface RubyAtom {
  readonly base: string // main content
  readonly text: string // annotation
}

class Ruby {
  private readonly _atoms: readonly RubyAtom[]

  constructor(atoms: readonly RubyAtom[]) {
    this._atoms = atoms
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
