export type Product = {
  id: number;
  name: string;
  img: string;
  price: string;
  description: string;
  category: string;
  rating: number;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Buku Tulis',
    img: 'https://upload.lexxganz.my.id/uploads/BukuTulis.png',
    price: 'Rp 15.000',
    description:
      'Buku tulis berkualitas tinggi dengan sampul menarik. Cocok untuk pelajar dan profesional. Tersedia dalam berbagai pilihan warna dan desain. Kertas tebal dan nyaman untuk menulis. Jadikan pengalaman menulismu lebih menyenangkan.',
    category: 'Alat Tulis',
    rating: 5,
  },
  {
    id: 2,
    name: 'Botol Minum',
    img: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 'Rp 50.000',
    description:
      'Botol minum stylish dan tahan lama, cocok untuk aktivitas sehari-hari. Terbuat dari bahan berkualitas tinggi yang aman untuk kesehatan. Desain ergonomis mudah digenggam. Pilihan tepat untuk menjaga hidrasi Anda. Tersedia dalam berbagai kapasitas dan warna menarik.',
    category: 'Peralatan Rumah Tangga',
    rating: 4,
  },
  {
    id: 3,
    name: 'Sepatu Kets',
    img: 'https://images-cdn.ubuy.co.id/644c24c751a79126282c5134-ritualay-men-comfortable-sneakers-warm.jpg',
    price: 'Rp 300.000',
    description:
      'Sepatu kets nyaman dan trendi untuk gaya kasual Anda. Dibuat dengan material berkualitas tinggi yang menjamin kenyamanan. Sol anti-slip memberikan keamanan saat berjalan. Desain modern cocok dipadukan dengan berbagai outfit. Tampil stylish dan percaya diri setiap saat.',
    category: 'Fashion',
    rating: 5,
  },
  {
    id: 4,
    name: 'Kaos Polos',
    img: 'https://down-id.img.susercontent.com/file/17a7ca87349d92a604ebbb86b63f1229',
    price: 'Rp 75.000',
    description:
      'Kaos polos bahan katun lembut, nyaman dipakai sepanjang hari. Tersedia dalam berbagai ukuran dan warna. Cocok untuk pria dan wanita. Mudah dipadukan dengan celana jeans atau rok. Pilihan sempurna untuk gaya santai Anda.',
    category: 'Fashion',
    rating: 4,
  },
  {
    id: 5,
    name: 'Jam Tangan',
    img: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 'Rp 250.000',
    description:
      'Jam tangan elegan dengan desain klasik, cocok untuk segala acara. Tahan air dan dilengkapi fitur tanggal. Strap kulit berkualitas tinggi memberikan kenyamanan. Tampil berkelas dan tepat waktu. Hadiah sempurna untuk orang terkasih.',
    category: 'Aksesoris',
    rating: 5,
  },
  {
    id: 6,
    name: 'Cangkir Kopi',
    img: 'https://cdn.ruparupa.io/fit-in/240x240/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10179908_1.jpg',
    price: 'Rp 25.000',
    description:
      'Cangkir kopi keramik dengan desain minimalis, nikmati kopi Anda. Tahan panas dan mudah dibersihkan. Cocok untuk penggunaan sehari-hari atau sebagai hadiah. Tambahkan sentuhan elegan pada momen minum kopi Anda. Tersedia dalam berbagai warna pastel.',
    category: 'Peralatan Rumah Tangga',
    rating: 4,
  },
  {
    id: 7,
    name: 'Kacamata',
    img: 'https://cdn.ruparupa.io/fit-in/400x400/filters:format(webp)/filters:quality(90)/ruparupa-com/image/upload/Products/10469343_1.jpg',
    price: 'Rp 120.000',
    description:
      'Kacamata fashion dengan perlindungan UV, tampil gaya dan aman. Lensa berkualitas tinggi melindungi mata dari sinar matahari. Desain modern dan ringan nyaman dipakai. Cocok untuk aktivitas di luar ruangan. Pilihan tepat untuk gaya dan kesehatan mata Anda.',
    category: 'Aksesoris',
    rating: 5,
  },
  {
    id: 8,
    name: 'Tas Ransel',
    img: 'https://upload.lexxganz.my.id/uploads/tas.png',
    price: 'Rp 200.000',
    description:
      'Tas ransel multifungsi dengan banyak kompartemen, ideal untuk perjalanan. Bahan kuat dan tahan air melindungi barang bawaan Anda. Tali bahu empuk nyaman saat digunakan. Desain stylish cocok untuk sekolah, kerja, atau traveling. Bawa semua kebutuhan Anda dengan mudah.',
    category: 'Fashion',
    rating: 4,
  },
  {
    id: 9,
    name: 'Apel Merah',
    img: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 'Rp 5.000',
    description:
      'Apel merah segar dan manis, sumber vitamin alami. Kaya akan serat dan antioksidan. Baik untuk kesehatan jantung dan pencernaan. Nikmati sebagai camilan sehat atau tambahan dalam salad buah. Pilihan buah segar untuk gaya hidup sehat Anda.',
    category: 'Makanan & Minuman',
    rating: 5,
  },
  {
    id: 10,
    name: 'Topi',
    img: 'https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 'Rp 60.000',
    description:
      'Topi bergaya untuk melindungi Anda dari sinar matahari. Terbuat dari bahan berkualitas yang nyaman dipakai. Desain trendi cocok untuk berbagai kesempatan. Lindungi wajah dan rambut Anda dengan gaya. Tersedia dalam berbagai model dan warna.',
    category: 'Aksesoris',
    rating: 4,
  },
  {
    id: 11,
    name: 'Sabun Batang',
    img: 'https://media.monotaro.id/mid01/big/Alat%20&%20Kebutuhan%20Kebersihan/Cuci%20Tangan,%20Cuci%20Mulut,%20Pembersih%20Tangan/Sabun%20Cuci%20Tangan/Dettol%20Sabun%20Batang%20Lasting%20Fresh/eeP104612518-2.jpg',
    price: 'Rp 7.000',
    description:
      'Sabun batang antiseptik untuk kebersihan kulit Anda. Membunuh kuman dan bakteri penyebab penyakit. Melembapkan kulit dan tidak membuat kering. Aroma segar yang tahan lama. Jaga kebersihan dan kesehatan kulit Anda setiap hari.',
    category: 'Perawatan Diri',
    rating: 5,
  },
  {
    id: 12,
    name: 'Handuk',
    img: 'https://xcdn.next.co.uk/common/items/default/default/itemimages/3_4Ratio/product/lge/E01504s.jpg?im=Resize,width=750',
    price: 'Rp 40.000',
    description:
      'Handuk lembut dan menyerap, nyaman setelah mandi. Terbuat dari bahan katun berkualitas tinggi. Cepat kering dan tidak mudah berbau. Tersedia dalam berbagai ukuran dan warna. Rasakan sensasi kelembutan setiap kali Anda menggunakannya.',
    category: 'Peralatan Rumah Tangga',
    rating: 4,
  },
  {
    id: 13,
    name: 'Piring Keramik',
    img: 'https://bimg.akulaku.net/goods/spu/6add7f1238614a268e1f7978e91d815b5047.jpg?w=726&q=80&fit=1',
    price: 'Rp 30.000',
    description:
      'Piring keramik berkualitas tinggi, mempercantik meja makan Anda. Desain elegan dan tahan panas. Aman digunakan di microwave dan dishwasher. Cocok untuk menyajikan hidangan sehari-hari atau acara spesial. Tambahkan sentuhan mewah pada pengalaman bersantap Anda.',
    category: 'Peralatan Rumah Tangga',
    rating: 5,
  },
  {
    id: 14,
    name: 'Sendok & Garpu',
    img: 'https://upload.lexxganz.my.id/uploads/sendokGarpu.png',
    price: 'Rp 20.000',
    description:
      'Set sendok dan garpu stainless steel, tahan karat dan elegan. Desain ergonomis nyaman digenggam. Mudah dibersihkan dan tahan lama. Cocok untuk penggunaan sehari-hari atau acara formal. Lengkapi peralatan makan Anda dengan set berkualitas ini.',
    category: 'Peralatan Rumah Tangga',
    rating: 4,
  },
  {
    id: 15,
    name: 'Lampu Meja',
    img: 'https://img.id.my-best.com/product_images/f52a085ce731b27e6fba5a89241f06ce.jpeg?ixlib=rails-4.3.1&q=70&lossless=0&w=800&h=800&fit=clip&s=b00f019efb4966dcc52323ea3b5f7b97',
    price: 'Rp 150.000',
    description:
      'Lampu meja modern dengan pencahayaan yang nyaman untuk membaca. Dilengkapi fitur pengaturan tingkat kecerahan. Desain minimalis cocok untuk berbagai interior. Hemat energi dan tahan lama. Ciptakan suasana nyaman untuk belajar atau bekerja.',
    category: 'Elektronik',
    rating: 5,
  },
  {
    id: 16,
    name: 'Tanaman Hias',
    img: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    price: 'Rp 80.000',
    description:
      'Tanaman hias cantik untuk memperindah ruangan Anda. Mudah dirawat dan cocok untuk pemula. Memberikan kesan asri dan segar di dalam rumah. Berbagai jenis tanaman tersedia untuk pilihan Anda. Hadirkan keindahan alam di setiap sudut ruangan.',
    category: 'Dekorasi Rumah',
    rating: 4,
  },
  {
    id: 17,
    name: 'Payung',
    img: 'https://parto.id/asset/foto_produk/Picture1_copy.jpg',
    price: 'Rp 55.000',
    description:
      'Payung lipat praktis, siap melindungi Anda dari hujan dan panas. Desain ringkas mudah dibawa kemana saja. Bahan berkualitas tinggi tahan angin dan air. Tersedia dalam berbagai warna cerah. Jangan biarkan cuaca buruk menghalangi aktivitas Anda.',
    category: 'Aksesoris',
    rating: 3,
  },
  {
    id: 18,
    name: 'Pensil',
    img: 'https://bosara.sultraprov.go.id/asset/foto_produk/product-puja-atlis-20230318042914982.jpg',
    price: 'Rp 3.000',
    description:
      'Pensil berkualitas untuk menulis dan menggambar. Mata pensil kuat tidak mudah patah. Nyaman digenggam untuk penggunaan jangka panjang. Cocok untuk pelajar, seniman, dan pekerja kantoran. Wujudkan ide-ide kreatif Anda dengan pensil terbaik.',
    category: 'Alat Tulis',
    rating: 4,
  },
  {
    id: 19,
    name: 'Roti Tawar',
    img: 'https://nibble-images.b-cdn.net/nibble/original_images/roti_sari_roti_double_soft_36a49020f4.jpg',
    price: 'Rp 18.000',
    description:
      'Roti tawar lembut, cocok untuk sarapan atau camilan. Terbuat dari bahan-bahan pilihan berkualitas. Tanpa pengawet dan aman dikonsumsi. Nikmati dengan selai, mentega, atau sebagai sandwich. Pilihan praktis untuk keluarga Anda.',
    category: 'Makanan & Minuman',
    rating: 5,
  },
  {
    id: 20,
    name: 'Pisang',
    img: 'https://upload.lexxganz.my.id/uploads/pisang.png',
    price: 'Rp 20.000',
    description:
      'Pisang segar kaya serat dan energi. Sumber potasium dan vitamin penting. Baik untuk pencernaan dan menjaga stamina. Nikmati sebagai camilan sehat atau tambahan dalam smoothie. Pilihan buah alami untuk gaya hidup aktif Anda.',
    category: 'Makanan & Minuman',
    rating: 4,
  },
];

export default products;
