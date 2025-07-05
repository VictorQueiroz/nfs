import which from "./which";

type InputCompilerExecutable = string | string[];

abstract class Compiler {
  public readonly executable: string;
  public constructor(
    public readonly name: string,
    executable: InputCompilerExecutable
  ) {
    this.executable = Array.isArray(executable) ? executable.join(" ") : executable;
  }
}

class GCC extends Compiler {
  public constructor(executable: InputCompilerExecutable) {
    super("gcc", executable);
  }
}

class Clang extends Compiler {
  public constructor(executable: InputCompilerExecutable) {
    super("clang", executable);
  }
}

class MSVC extends Compiler {
  public constructor(executable: InputCompilerExecutable) {
    super("msvc", executable);
  }
}

export enum CompilerLanguageType {
  C = "c",
  CXX = "cxx"
}

/**
 * Find the native compiler of the system for the given language type.
 * @throws {Error} If the OS is not supported.
 * @returns A `Compiler` instance representing the compiler.
 */
export default async function nativeCompiler(
  compilerLanguageType: CompilerLanguageType
): Promise<Compiler> {
  const os = await import("os");
  if (os.type() === "Windows_NT") {
    return new MSVC(await which("cl.exe"));
  } else if (os.type() === "Linux") {
    return new GCC(
      compilerLanguageType === CompilerLanguageType.CXX ? await which("g++") : await which("gcc")
    );
  } else if (os.type() === "Darwin") {
    return new Clang(
      await which(compilerLanguageType === CompilerLanguageType.CXX ? "clang++" : "clang")
    );
  }
  throw new Error(`Unsupported OS: ${os.type()}`);
}
