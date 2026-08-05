import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../../core/currency.service';

@Pipe({
  name: 'fxCurrency',
  pure: false
})
export class FxCurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(valueInNgn: number | undefined | null, targetCode?: string): string {
    if (valueInNgn === null || valueInNgn === undefined || isNaN(valueInNgn)) {
      return '';
    }
    const result = this.currencyService.convert(valueInNgn, targetCode);
    return result.formatted;
  }
}
