import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared components
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

// Page components
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ShopComponent } from './pages/shop-cart/shop-cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { MenSectionComponent } from './pages/men-section/men-section.component';
import { WomenSectionComponent } from './pages/women-section/women-section.component';
import { KidsSectionComponent } from './pages/kids-section/kids-section.component';
import { CartComponent } from './pages/cart/cart.component'; 
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CartService } from './core/cart.service';
import { ProductService } from './core/product.service';
import { DecimalPipe } from '@angular/common';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { MenShirtsComponent } from './pages/men-section/men-shirts/men-shirts.component';
import { MenTShirtsComponent } from './pages/men-section/men-tshirts/men-tshirts.component';
import { MenPantsComponent } from './pages/men-section/men-pants/men-pants.component';
import { MenHoodiesComponent } from './pages/men-section/men-hoodies/men-hoodies.component';
import { MenNativeComponent } from './pages/men-section/men-native/men-native.component';
import { WomenJoggersComponent } from './pages/women-section/women-joggers/women-joggers.component';
import { WomenTopsComponent } from './pages/women-section/women-tops/women-tops.component';
import { WomenSkirtsComponent } from './pages/women-section/women-skirts/women-skirts.component';
import { WomenHoodiesComponent } from './pages/women-section/women-hoodies/women-hoodies.component';
import { WomenGownsComponent } from './pages/women-section/women-gowns/women-gowns.component';
import { KidsTshirtsComponent } from './pages/kids-section/kids-tshirts/kids-tshirts.component';
import { KidsShortsComponent } from './pages/kids-section/kids-shorts/kids-shorts.component';
import { KidsHoodiesComponent } from './pages/kids-section/kids-hoodies/kids-hoodies.component';
import { KidsDressesComponent } from './pages/kids-section/kids-dresses/kids-dresses.component';
import { KidsNativeComponent } from './pages/kids-section/kids-native/kids-native.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthComponent } from './pages/auth/auth.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NativeCarouselComponent } from './shared/native-carousel/native-carousel.component';
import { FxCurrencyPipe } from './shared/pipes/fx-currency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ContactComponent,
    ShopComponent,
    CheckoutComponent,
    MenSectionComponent,
    WomenSectionComponent,
    KidsSectionComponent,
    CartComponent,
    WishlistComponent,
    ProductViewComponent,
    MenShirtsComponent,
    MenTShirtsComponent,
    MenPantsComponent,
    MenHoodiesComponent,
    MenNativeComponent,
    WomenJoggersComponent,
    WomenTopsComponent,
    WomenSkirtsComponent,
    WomenHoodiesComponent,
    WomenGownsComponent,
    KidsTshirtsComponent,
    KidsShortsComponent,
    KidsHoodiesComponent,
    KidsDressesComponent,
    KidsNativeComponent,
    ProfileComponent,
    AuthComponent,
    AdminComponent,
    NativeCarouselComponent,
    FxCurrencyPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CartService,
    ProductService,
    DecimalPipe       
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
