import { CompilerInterface } from './compiler.interface.js';
import { JsonCompiler } from './json.compiler.js';
import { NamespacedJsonCompiler } from './namespaced-json.compiler.js';
import { PoCompiler } from './po.compiler.js';
import { ContextJsonCompiler } from './context-json.compiler.js';

export class CompilerFactory {
	public static create(format: string, options?: {}): CompilerInterface {
		switch (format) {
			case 'pot':
				return new PoCompiler(options);
			case 'json':
				return new JsonCompiler(options);
			case 'namespaced-json':
				return new NamespacedJsonCompiler(options);
			case 'context-json':
				return new ContextJsonCompiler(options);
			default:
				throw new Error(`Unknown format: ${format}`);
		}
	}
}
