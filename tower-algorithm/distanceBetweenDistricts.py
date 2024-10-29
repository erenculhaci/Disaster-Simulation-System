

def calculate(lat1, lon1, lat2, lon2):
    result_lon = abs(lon2 - lon1)
    result_lat = abs(lat2 - lat1)
    distance = (result_lat**2 + result_lon**2)**(1/2)
    return distance

if __name__ == '__main__':
    districts = [
        ("Gaziosmanpaşa", 41.05998424588983, 28.91134874961153),
        ("Ümraniye", 41.024663276213616, 29.09805298065148),
        ("Sultangazi", 41.092598783043925, 28.873062036249486),
        ("Kağıthane", 41.0584501406787, 28.957000170184546),
        ("Çekmeköy", 41.07361457006322, 29.26666187342869),
        ("Pendik", 40.886028701201845, 29.219633811577076),
        ("Üsküdar", 41.04729594928249, 29.076934883025835),
        ("Arnavutköy", 41.26721055885751, 28.721636867069975),
        ("Sarıyer", 41.18678282197294, 29.016627910829893),
        ("Sancaktepe", 41.02646406990321, 29.307931014633912),
        ("Şişli", 41.0587480755776, 28.98496705733792),
        ("Beykoz", 41.13637302231602, 29.342603144507322),
        ("Kadıköy", 40.98362515674333, 29.07543180085441),
        ("Esenyurt", 41.04530118623401, 28.648026103969613),
        ("Başakşehir", 41.089389783627816, 28.760633489736144),
        ("Kartal", 40.93825292100485, 29.21725126727171),
        ("Maltepe", 40.9540798050057, 29.14123731370963),
        ("Ataşehir", 41.005014232081315, 29.089925158258943),
        ("Eyüpsultan", 41.05312453382489, 28.92036103801329),
        ("Bağcılar", 41.04337280597154, 28.836714935964245),
        ("Sultanbeyli", 40.946160854578544, 29.252876692281312),
        ("Küçükçekmece", 41.02499895921285, 28.805687565328668),
        ("Beşiktaş", 41.09937779730743, 29.029243817468597),
        ("Esenler", 41.035300398972566, 28.885315266173855),
        ("Avcılar", 41.05392601503717, 28.686283558873267),
        ("Bahçelievler", 41.01065495664996, 28.842577742613493),
        ("Beyoğlu", 41.06439746776021, 28.95110660632854),
        ("Beylikdüzü", 40.96174568538635, 28.632806416716825),
        ("Silivri", 41.117226412841596, 28.27508368363411),
        ("Tuzla", 40.88189097715707, 29.380126988809216),
        ("Şile", 41.08424239192786, 29.57695014381875),
        ("Çatalca", 41.223605691418065, 28.43665361051425),
        ("Fatih", 41.01453928320167, 28.97833780389945),
        ("Büyükçekmece", 41.05623763276542, 28.410664964420217),
        ("Bayrampaşa", 41.039456122067435, 28.90212503315849),
        ("Güngören", 41.00872848577626, 28.888793986144616),
        ("Zeytinburnu", 41.02740030372349, 28.917276950334223),
        ("Bakırköy", 40.982292940510256, 28.874851704825993)
    ]

    distances = {}

    for i, (name1, lat1, lon1) in enumerate(districts):
        for j, (name2, lat2, lon2) in enumerate(districts):
            if i < j:
                distance = calculate(lat1, lon1, lat2, lon2)
                distances[(name1, name2)] = distance

    for (name1, name2), distance in distances.items():
        print(f"{name1} - {name2} | {distance:.20f}")
