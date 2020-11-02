import {FormsModule } from '@angular/forms';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { IntegerInputDirective } from './integer-input-directive';

// Setup a dummy component with a template, to apply the directive to
@Component({ template: `<input type="text" [(ngModel)]="test" appInteger>` })
export class TestIntegerInputComponent { }

describe('IntegerInputDirective', () => {

  let component: TestIntegerInputComponent;
  let fixture: ComponentFixture<TestIntegerInputComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      declarations: [TestIntegerInputComponent, IntegerInputDirective],
      imports: [FormsModule]
    });
    fixture = TestBed.createComponent(TestIntegerInputComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
  });

  it('should restrict non-numeric input', () => {
    inputEl.nativeElement.value = 'ddd ';
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();

    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should strip non-numeric input whilst allowing numeric input', () => {
    inputEl.nativeElement.value = '1 2.3ddd';
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();

    expect(inputEl.nativeElement.value).toBe('123');
  });
});
