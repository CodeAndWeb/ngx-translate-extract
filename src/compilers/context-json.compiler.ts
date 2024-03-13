import { CompilerInterface } from './compiler.interface.js';
import { TranslationCollection, TranslationInterface, TranslationType } from '../utils/translation.collection.js';
import { stripBOM } from '../utils/utils.js';

export class ContextJsonCompiler implements CompilerInterface {
	public indentation: string = '\t';

	public valueKey: string = 'value';
	public contextKey: string = 'context';

	public extension: string = 'json';

	public constructor(options?: any) {
		if (options && typeof options.indentation !== 'undefined') {
			this.indentation = options.indentation;
		}

		if (options && typeof options.contextKey !== 'undefined') {
			this.contextKey = options.contextKey;
		}

		if (options && typeof options.valueKey !== 'undefined') {
			this.valueKey = options.valueKey;
		}
	}

	public compile(collection: TranslationCollection): string {
		const entries = Object.entries(collection.toKeyTranslationObject());
		const values: Record<string, any> = {};
		for (const [key, translation] of entries) {
			values[key] = {
				[this.valueKey]: translation.value,
				[this.contextKey]: translation.context
			};
		}
		return JSON.stringify(values, null, this.indentation);
	}

	public parse(contents: string): TranslationCollection {
		const values: any = JSON.parse(stripBOM(contents));
		if (!this.isNamespacedJsonFormat(values)) {
			const newValues: TranslationType = {};
			Object.entries(values).forEach(([key, value]: [string, string]) => newValues[key] = <TranslationInterface>{ value: value, sourceFiles: [] });
			return new TranslationCollection(newValues);
		}

		const newValuesWithContext: TranslationType = {};
		Object.entries(values).forEach(([key, value]: [string, any]) => newValuesWithContext[key] = <TranslationInterface>{ value: value[this.valueKey], context: value[this.contextKey], sourceFiles: [] });
		return new TranslationCollection(newValuesWithContext);
	}

	protected isNamespacedJsonFormat(values: any): boolean {
		return Object.keys(values).some((key) => typeof values[key] === 'object');
	}
}
