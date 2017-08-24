// Type definitions for readdirp
// Project: https://github.com/thlorenz/readdirp
// Definitions by: Laurens Rietveld <https://github.com/Laurens Rietveld>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

// declare module 'mkdirp' {
//
// 	function mkdirp(dir: string, cb: (err: any, made: string) => void): void;
// 	function mkdirp(dir: string, flags: any, cb: (err: any, made: string) => void): void;
//
// 	module mkdirp {
// 		function sync(dir: string, flags?: any): string;
// 	}
// 	export = mkdirp;
// }
declare module "readdirp" {
  function readdirp(config: readdirp.Config): NodeJS.ReadableStream;
  function readdirp(config: readdirp.Config, allProcssedCb: readdirp.AllProcessed): void;
  function readdirp(
    config: readdirp.Config,
    fileProcessedCb: readdirp.FileProcessed,
    allProcssedCb: readdirp.AllProcessed
  ): void;
  namespace readdirp {
    export interface Stats {
      isFile(): boolean;
      isDirectory(): boolean;
      isBlockDevice(): boolean;
      isCharacterDevice(): boolean;
      isSymbolicLink(): boolean;
      isFIFO(): boolean;
      isSocket(): boolean;
      dev: number;
      ino: number;
      mode: number;
      nlink: number;
      uid: number;
      gid: number;
      rdev: number;
      size: number;
      blksize: number;
      blocks: number;
      atime: Date;
      mtime: Date;
      ctime: Date;
      birthtime: Date;
    }
    export interface EntryInfo {
      /**
             * directory in which entry was found (relative to given root)
             */
      parentDir: string;
      /**
             * full path to parent directory
             */
      fullParentDir: string;
      /**
             * name of the file/directory
             */
      name: string;
      /**
             * path to the file/directory (relative to given root)
             */
      path: string;
      /**
             * full path to the file/directory found
             */
      fullPath: string;
      /**
             * built in stat object
             */
      stat: Stats;
    }

    export interface FilterFunction {
      (entryInfo: EntryInfo): Boolean;
    }

    export interface Config {
      /**
             * path in which to start reading and recursing into subdirectories
             */
      root?: String;
      /**
             * filter to include/exclude files found (see Filters for more)
             */
      fileFilter?: FilterFunction | String | Array<String>;
      /**
             * filter to include/exclude directories found and to recurse into (see Filters for more)
             */
      directoryFilter?: FilterFunction | String | Array<String>;
      /**
             * depth at which to stop recursing even if more subdirectories are found
             */
      depth?: Number;
      /**
             * determines if data events on the stream should be emitted for 'files', 'directories', 'both', or 'all'. Setting to 'all' will also include entries for other types of file descriptors like character devices, unix sockets and named pipes. Defaults to 'files'.
             */
      entryType?: String;
      /**
             * if true, readdirp uses fs.lstat instead of fs.stat in order to stat files and includes symlink entries in the stream along with files.
             */
      lstat?: Boolean;
    }
    export interface FileProcessed {
      (entryInfo: EntryInfo): void;
    }
    export interface AllProcessed {
      (err: Error[], entryInfo: { files: EntryInfo[] }): void;
    }
  }
  export = readdirp;
}
