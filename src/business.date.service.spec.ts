import { TestingModule, Test } from '@nestjs/testing';
import { BusinessDateService } from './business.date.service';
describe('BusinessDateService', () => {
  let service: BusinessDateService;

  beforeEach(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      providers: [BusinessDateService],
    }).compile();

    service = mod.get<BusinessDateService>(BusinessDateService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  describe('Given start Date is 2018-12-12T10:10:10Z and delay is 3', () => {
    it('should return a valid business date', () => {
      const date: Date = new Date('2018-12-12T10:10:10Z');
      const delay: number = 3;
      const country: string = 'US';
      const output = service.getDate(date, delay, country);
      expect(output.ok).toBeTruthy();
      expect(output.results.totalDays).toEqual(6);
      expect(output.results.weekendDays).toEqual(2);
      expect(output.results.businessDate).toEqual('Monday, December 17th 2018');
      expect(output.results.holidays).toEqual(0);
    });
  });

  describe('Given start Date is November 15 2018 and delay is 3', () => {
    it('should return a valid business date', () => {
      const date: Date = new Date('November 15 2018');
      const delay: number = 3;
      const country: string = 'US';
      const output = service.getDate(date, delay, country);
      expect(output.ok).toBeTruthy();
      expect(output.results.totalDays).toEqual(6);
      expect(output.results.weekendDays).toEqual(2);
      expect(output.results.businessDate).toEqual(
        'Tuesday, November 20th 2018',
      );
      expect(output.results.holidays).toEqual(0);
    });
  });

  describe('Given start Date is December 25 2018 and delay is 20', () => {
    it('should return a valid business date', () => {
      const date: Date = new Date('December 25 2018');
      const delay: number = 20;
      const country: string = 'US';
      const output = service.getDate(date, delay, country);
      expect(output.ok).toBeTruthy();
      expect(output.results.weekendDays).toEqual(8);
      expect(output.results.totalDays).toEqual(32);
      expect(output.results.businessDate).toEqual('Friday, January 25th 2019');
      expect(output.results.holidays).toEqual(3);
    });
  });

  describe('December 25 2018 in the US', () => {
    it('is not a business date', () => {
      const date: Date = new Date('December 25 2018');
      const country: string = 'US';
      const output = service.isBusinessDate(date, country);
      expect(output).toBeFalsy();
    });
  });

  describe('December 26 2018 in the US', () => {
    it('is not a business date', () => {
      const date: Date = new Date('December 26 2018');
      const country: string = 'US';
      const output = service.isBusinessDate(date, country);
      expect(output).toBeFalsy();
    });
  });

  describe('January 22 2019 in the US', () => {
    it('is not a business date', () => {
      const date: Date = new Date('January 22 2019');
      const country: string = 'US';
      const output = service.isBusinessDate(date, country);
      expect(output).toBeFalsy();
    });
  });

  describe('January 23 2019 in the US', () => {
    it('is a business date', () => {
      const date: Date = new Date('January 23 2019');
      const country: string = 'US';
      const output = service.isBusinessDate(date, country);
      expect(output).toBeTruthy();
    });
  });
});
