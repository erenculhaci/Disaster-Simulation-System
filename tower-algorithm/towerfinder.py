import pandas as pd

file_path = './data.csv'
df = pd.read_csv(file_path)

df = df.drop_duplicates(subset='District')

df['Towers Inside'] = 0

def calculate_var6(df):
    df['var6'] = 5 * df['Percentage'] + df['Percentage'].rolling(window=5, min_periods=1).sum()
    return df

def distribute_towers(df, num_towers):
    df = calculate_var6(df)
    while num_towers > 0:

        df['var4'] = df['var6'] / (1 + df['Towers Inside'])
        
        highest_var4_index = df['var4'].idxmax()
        
        df.loc[highest_var4_index, 'Towers Inside'] += 1
        num_towers -= 1
        
        df = calculate_var6(df)  
        df['var4'] = df['var6'] / (1 + df['Towers Inside'])  
    
    return df

num_towers = 100

result_df = distribute_towers(df, num_towers)

result_df = result_df.drop_duplicates(subset='District')

print("Final Tower Distribution:")
print(result_df[['District', 'Towers Inside']].to_string(index=False))

result_df.to_csv('./output.csv', index=False)
