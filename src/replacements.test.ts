import { applyReplacements } from './replacements';

describe('De-AI Replacements', () => {
  test('replaces em-dashes with hyphens', () => {
    expect(applyReplacements('word—word')).toBe('word - word');
    expect(applyReplacements('text — more text')).toBe('text - more text');
  });

  test('replaces "delve into" before "delve"', () => {
    expect(applyReplacements('delve into the topic')).toBe('explore the topic');
    expect(applyReplacements('Delve Into the topic')).toBe('Explore the topic');
  });

  test('replaces "delve" with "dive deep"', () => {
    expect(applyReplacements('Let us delve further')).toBe('Let us dive deep further');
  });

  test('replaces "at its core" phrase', () => {
    expect(applyReplacements('At its core, this is simple')).toBe('Fundamentally, this is simple');
    expect(applyReplacements('at its core')).toBe('as its backbone');
  });

  test('replaces "underscores" and inflections', () => {
    expect(applyReplacements('This underscores the point')).toBe('This highlights the point');
    expect(applyReplacements('This underscored the issue')).toBe('This highlighted the issue');
    expect(applyReplacements('By underscoring this')).toBe('By highlighting this');
  });

  test('replaces "seamless integration"', () => {
    expect(applyReplacements('seamless integration of APIs')).toBe('smooth compatibility of APIs');
    expect(applyReplacements('Seamless Integration')).toBe('Smooth Compatibility');
  });

  test('replaces "that being said"', () => {
    expect(applyReplacements('That being said, we continue')).toBe('However, we continue');
  });

  test('replaces "typically"', () => {
    expect(applyReplacements('typically works well')).toBe('usually works well');
    expect(applyReplacements('Typically Works')).toBe('Usually Works');
  });

  test('replaces "cutting-edge"', () => {
    expect(applyReplacements('cutting-edge technology')).toBe('advanced technology');
  });

  test('replaces "game-changing"', () => {
    expect(applyReplacements('game-changing approach')).toBe('significant approach');
  });

  test('replaces "revolutionize" and inflections', () => {
    expect(applyReplacements('will revolutionize the realm')).toBe('will transform the area');
    expect(applyReplacements('revolutionized the industry')).toBe('transformed the industry');
  });

  test('replaces "streamline" and inflections', () => {
    expect(applyReplacements('The tool streamlines workflows')).toBe('The tool simplifies workflows');
    expect(applyReplacements('streamlined process')).toBe('simplified process');
  });

  test('replaces "bolster" and inflections', () => {
    expect(applyReplacements('bolsters results')).toBe('supports results');
    expect(applyReplacements('bolstered by data')).toBe('supported by data');
  });

  test('replaces "harness" and inflections', () => {
    expect(applyReplacements('we harness data')).toBe('we use data');
    expect(applyReplacements('harnessed for good')).toBe('used for good');
  });

  test('replaces "illuminate" and inflections', () => {
    expect(applyReplacements('to illuminate trends')).toBe('to explain trends');
    expect(applyReplacements('illuminating the path')).toBe('explaining the path');
  });

  test('replaces "realm"', () => {
    expect(applyReplacements('in the realm of science')).toBe('in the area of science');
  });

  test('handles full test case 1', () => {
    const input = 'At its core, this seamless integration will revolutionize the realm.';
    const expected = 'Fundamentally, this smooth compatibility will transform the area.';
    expect(applyReplacements(input)).toBe(expected);
  });

  test('handles full test case 2', () => {
    const input = 'That being said, it typically underscores a cutting-edge approach—game-changing, really.';
    const expected = 'However, it usually highlights an advanced approach - significant, really.';
    expect(applyReplacements(input)).toBe(expected);
  });

  test('handles full test case 3', () => {
    const input = 'The tool streamlines workflows and bolsters results.';
    const expected = 'The tool simplifies workflows and supports results.';
    expect(applyReplacements(input)).toBe(expected);
  });

  test('handles full test case 4', () => {
    const input = 'To put it simply, we harness data to illuminate trends.';
    const expected = 'In simpler terms, we use data to explain trends.';
    expect(applyReplacements(input)).toBe(expected);
  });

  test('preserves case for ALL CAPS', () => {
    expect(applyReplacements('DELVE INTO THIS')).toBe('EXPLORE THIS');
    expect(applyReplacements('TYPICALLY')).toBe('USUALLY');
  });

  test('preserves case for Title Case', () => {
    expect(applyReplacements('Delve Into The Matter')).toBe('Explore The Matter');
  });

  test('does not double-replace', () => {
    const input = 'delve into';
    const firstPass = applyReplacements(input);
    const secondPass = applyReplacements(firstPass);
    expect(firstPass).toBe(secondPass);
  });
});
