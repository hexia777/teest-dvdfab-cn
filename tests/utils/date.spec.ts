import { describe, test, expect } from 'vitest'
import { transformDate } from '../../utils/date'

describe('transformDate', () => {
  test('should return an empty string for an invalid date', () => {
    expect(transformDate('invalid-date', 'en')).toEqual('');
  });

  test('should transform date to English format', () => {
    expect(transformDate('2024-05-14', 'en')).toEqual('May 14, 2024');
  });

  test('should transform date to German format', () => {
    expect(transformDate('2024-05-14', 'de')).toEqual('14. Mai 2024');
  });

  test('should transform date to French format', () => {
    expect(transformDate('2024-05-14', 'fr')).toEqual('14 mai 2024');
  });

  test('should transform date to Chinese format', () => {
    expect(transformDate('2024-05-14', 'zh')).toEqual('5/14/2024');
  });
});
