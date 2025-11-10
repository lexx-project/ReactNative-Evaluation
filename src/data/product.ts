export type ProductCategory =
  | 'Populer'
  | 'Terbaru'
  | 'Diskon'
  | 'Elektronik'
  | 'Pakaian'
  | 'Makanan'
  | 'Otomotif'
  | 'PerlengkapanBayi';

export type Product = {
  id: number;
  name: string;
  img: string;
  price: string;
  rating: number;
  categories: ProductCategory[];
};

const products: Product[] = [
  {
    id: 1,
    name: 'Buku Tulis',
    img: 'https://upload.lexxganz.my.id/uploads/BukuTulis.png',
    price: '15.000',
    rating: 5,
    categories: ['Populer', 'Terbaru'],
  },
  {
    id: 2,
    name: 'Botol Minum',
    img: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: '50.000',
    rating: 4,
    categories: ['Populer', 'Makanan'],
  },
  {
    id: 3,
    name: 'Sepatu Kets',
    img: 'https://images-cdn.ubuy.co.id/644c24c751a79126282c5134-ritualay-men-comfortable-sneakers-warm.jpg',
    price: '300.000',
    rating: 5,
    categories: ['Populer', 'Pakaian'],
  },
  {
    id: 4,
    name: 'Kaos Polos',
    img: 'https://down-id.img.susercontent.com/file/17a7ca87349d92a604ebbb86b63f1229',
    price: '75.000',
    rating: 4,
    categories: ['Pakaian', 'Terbaru'],
  },
  {
    id: 5,
    name: 'Jam Tangan',
    img: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: '250.000',
    rating: 5,
    categories: ['Populer', 'Diskon'],
  },
  {
    id: 6,
    name: 'Cangkir Kopi',
    img: 'https://cdn.ruparupa.io/fit-in/240x240/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10179908_1.jpg',
    price: '25.000',
    rating: 4,
    categories: ['Makanan', 'Terbaru'],
  },
  {
    id: 7,
    name: 'Kacamata',
    img: 'https://cdn.ruparupa.io/fit-in/400x400/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10469343_1.jpg',
    price: '120.000',
    rating: 5,
    categories: ['Populer', 'Diskon'],
  },
  {
    id: 8,
    name: 'Tas Ransel',
    img: 'https://upload.lexxganz.my.id/uploads/tas.png',
    price: '200.000',
    rating: 4,
    categories: ['Pakaian', 'Populer'],
  },
  {
    id: 9,
    name: 'Apel Merah',
    img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: '5.000',
    rating: 5,
    categories: ['Makanan', 'Populer'],
  },
  {
    id: 10,
    name: 'Topi',
    img: 'https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: '60.000',
    rating: 4,
    categories: ['Pakaian'],
  },
  {
    id: 11,
    name: 'Sabun Batang',
    img: 'https://media.monotaro.id/mid01/big/Alat%20&%20Kebutuhan%20Kebersihan/Cuci%20Tangan,%20Cuci%20Mulut,%20Pembersih%20Tangan/Sabun%20Cuci%20Tangan/Dettol%20Sabun%20Batang%20Lasting%20Fresh/eeP104612518-2.jpg',
    price: '7.000',
    rating: 5,
    categories: ['Terbaru'],
  },
  {
    id: 12,
    name: 'Handuk',
    img: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/E01504s.jpg?im=Resize,width=750',
    price: '40.000',
    rating: 4,
    categories: ['Terbaru', 'PerlengkapanBayi'],
  },
  {
    id: 13,
    name: 'Piring Keramik',
    img: 'https://bimg.akulaku.net/goods/spu/6add7f1238614a268e1f7978e91d815b5047.jpg?w=726&q=80&fit=1',
    price: '30.000',
    rating: 5,
    categories: ['Makanan'],
  },
  {
    id: 14,
    name: 'Sendok & Garpu',
    img: 'https://upload.lexxganz.my.id/uploads/sendokGarpu.png',
    price: '20.000',
    rating: 4,
    categories: ['Makanan'],
  },
  {
    id: 15,
    name: 'Lampu Meja',
    img: 'https://img.id.my-best.com/product_images/f52a085ce731b27e6fba5a89241f06ce.jpeg?ixlib=rails-4.3.1&q=70&lossless=0&w=800&h=800&fit=clip&s=b00f019efb4966dcc52323ea3b5f7b97',
    price: '150.000',
    rating: 5,
    categories: ['Elektronik', 'Terbaru'],
  },
  {
    id: 16,
    name: 'Tanaman Hias',
    img: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: '80.000',
    rating: 4,
    categories: ['Populer'],
  },
  {
    id: 17,
    name: 'Payung',
    img: 'https://parto.id/asset/foto_produk/Picture1_copy.jpg',
    price: '55.000',
    rating: 3,
    categories: ['Populer', 'Diskon'],
  },
  {
    id: 18,
    name: 'Pensil',
    img: 'https://bosara.sultraprov.go.id/asset/foto_produk/product-puja-atlis-20230318042914982.jpg',
    price: '3.000',
    rating: 4,
    categories: ['Populer', 'Terbaru'],
  },
  {
    id: 19,
    name: 'Roti Tawar',
    img: 'https://nibble-images.b-cdn.net/nibble/original_images/roti_sari_roti_double_soft_36a49020f4.jpg',
    price: '18.000',
    rating: 5,
    categories: ['Makanan'],
  },
  {
    id: 20,
    name: 'Pisang',
    img: 'https://upload.lexxganz.my.id/uploads/pisang.png',
    price: '20.000',
    rating: 4,
    categories: ['Makanan'],
  },
  {
    id: 21,
    name: 'Helm Motor',
    img: 'https://upload.lexxganz.my.id/uploads/helm.png',
    price: '350.000',
    rating: 5,
    categories: ['Otomotif', 'Populer'],
  },
  {
    id: 22,
    name: 'Stroller Bayi',
    img: 'https://upload.lexxganz.my.id/uploads/stroller.png',
    price: '800.000',
    rating: 4,
    categories: ['PerlengkapanBayi', 'Terbaru'],
  },
  {
    id: 23,
    name: 'Earphone Wireless',
    img: 'https://images.pexels.com/photos/3394653/pexels-photo-3394653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: '420.000',
    rating: 5,
    categories: ['Elektronik', 'Populer'],
  },
];

export default products;
