import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {proteinVideo, videoChapterAt, bindProteinVideo} from '../dist/chapter3/protein-video.js';

test('video scenes cover the entire narration and select the correct scene at boundaries', () => {
  const scenes = proteinVideo.chapters;
  assert.equal(scenes[0].start, 0);
  assert.equal(scenes.at(-1).end, proteinVideo.duration);
  scenes.forEach((scene, index) => {
    assert(scene.end > scene.start);
    if (index) assert.equal(scene.start, scenes[index - 1].end);
    assert.equal(videoChapterAt(scene.start), index);
    assert.equal(videoChapterAt(scene.end - 0.001), index);
  });
  assert.equal(videoChapterAt(proteinVideo.duration), scenes.length - 1);
});

test('captions are ordered, in bounds and retain the start, elongation and stop relationships', () => {
  const vtt = fs.readFileSync(new URL('../dist/chapter3/assets/protein-synthesis.en.vtt', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const seconds = value => value.split(':').reduce((total, part) => total * 60 + Number(part), 0);
  const cues = [...vtt.matchAll(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})\n([^\n]+)/g)];
  assert.equal(cues.length, 28);
  let end = 0;
  for (const cue of cues) {
    const start = seconds(cue[1]);
    assert(start >= end);
    end = seconds(cue[2]);
    assert(end > start && end <= proteinVideo.duration);
  }
  assert.match(vtt, /AUG.*UAC.*methionine/);
  assert.match(vtt, /GGC matches CCG, bringing glycine/);
  assert.match(vtt, /UUU pairs with AAA, bringing phenylalanine/);
  assert.match(vtt, /UGA means stop/);
  assert.match(vtt, /No amino acid is added/);
});

function element() {
  const listeners = new Map();
  return {
    listeners, attributes: new Map(), textContent: '',
    addEventListener(type, fn) { listeners.set(type, fn); },
    removeEventListener(type, fn) { if (listeners.get(type) === fn) listeners.delete(type); },
    setAttribute(name, value) { this.attributes.set(name, value); },
    removeAttribute(name) { this.attributes.delete(name); },
    fire(type) { listeners.get(type)?.(); }
  };
}

test('scene shortcuts seek without starting playback, and leaving the activity stops audio', () => {
  const player = Object.assign(element(), {currentTime: 0, pauseCount: 0, pause() { this.pauseCount++; }});
  const buttons = proteinVideo.chapters.map(element);
  const status = element();
  const root = {
    querySelector: selector => selector === '[data-protein-player]' ? player : status,
    querySelectorAll: () => buttons
  };
  const cleanup = bindProteinVideo(root);
  buttons[9].fire('click');
  assert.equal(player.currentTime, 89);
  assert.equal(buttons[9].attributes.get('aria-current'), 'true');
  assert.match(status.textContent, /UGA/);
  player.currentTime = 99;
  player.fire('timeupdate');
  assert(!buttons[9].attributes.has('aria-current'));
  assert.equal(buttons[10].attributes.get('aria-current'), 'true');
  player.fire('error');
  assert.match(status.textContent, /transcript/);
  cleanup();
  assert.equal(player.pauseCount, 1);
  assert.equal(player.listeners.size, 0);
  assert(buttons.every(button => button.listeners.size === 0));
});
