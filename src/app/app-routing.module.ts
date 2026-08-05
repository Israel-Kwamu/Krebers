import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop-cart/shop-cart.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { KidsNativeComponent } from './pages/kids-section/kids-native/kids-native.component';
import { KidsHoodiesComponent } from './pages/kids-section/kids-hoodies/kids-hoodies.component';
import { KidsDressesComponent } from './pages/kids-section/kids-dresses/kids-dresses.component';
import { KidsShortsComponent } from './pages/kids-section/kids-shorts/kids-shorts.component';
import { KidsTshirtsComponent } from './pages/kids-section/kids-tshirts/kids-tshirts.component';

// Men components
import { MenShirtsComponent } from './pages/men-section/men-shirts/men-shirts.component';
import { MenTShirtsComponent } from './pages/men-section/men-tshirts/men-tshirts.component';
import { MenPantsComponent } from './pages/men-section/men-pants/men-pants.component';
import { MenHoodiesComponent } from './pages/men-section/men-hoodies/men-hoodies.component';
import { MenNativeComponent } from './pages/men-section/men-native/men-native.component';

// Women components
import { WomenJoggersComponent } from './pages/women-section/women-joggers/women-joggers.component';
import { WomenTopsComponent } from './pages/women-section/women-tops/women-tops.component';
import { WomenSkirtsComponent } from './pages/women-section/women-skirts/women-skirts.component';
import { WomenHoodiesComponent } from './pages/women-section/women-hoodies/women-hoodies.component';
import { WomenGownsComponent } from './pages/women-section/women-gowns/women-gowns.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'product/:id', component: ProductViewComponent },
  { path: 'kidsNative', component: KidsNativeComponent },
  { path: 'kidsHoodies', component: KidsHoodiesComponent },
  { path: 'kidsDress', component: KidsDressesComponent },
  { path: 'kidsShort', component: KidsShortsComponent },
  { path: 'kidsTshirt', component: KidsTshirtsComponent },
  
  // Men routes
  { path: 'menShirts', component: MenShirtsComponent },
  { path: 'menTshirt', component: MenTShirtsComponent },
  { path: 'menPants', component: MenPantsComponent },
  { path: 'menHoodies', component: MenHoodiesComponent },
  { path: 'menNative', component: MenNativeComponent },

  // Women routes
  { path: 'womenJoggers', component: WomenJoggersComponent },
  { path: 'womenTops', component: WomenTopsComponent },
  { path: 'womenSkirts', component: WomenSkirtsComponent },
  { path: 'womenHoodies', component: WomenHoodiesComponent },
  { path: 'womenGowns', component: WomenGownsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
