import pandas as pd

file_path = './data.csv'
df = pd.read_csv(file_path)

df['var3'] = df['Destruction Rate'] * df['Population Rate']

df['var6'] = df['var3'].rolling(window=5, min_periods=1).sum()

df['Towers Inside'] = 0

def distribute_towers(df, num_towers):
    while num_towers > 0:

        df['var4'] = df['var6'] / (1 + df['Towers Inside'])
        
        highest_var4_index = df['var4'].idxmax()
        
        df.loc[highest_var4_index, 'Towers Inside'] += 1
        num_towers -= 1
        
        df['var4'] = df['var6'] / (1 + df['Towers Inside'])
    
    return df

num_towers = 100

result_df = distribute_towers(df, num_towers)

print("Final Tower Distribution:")
print(result_df[['District', 'Towers Inside']])
