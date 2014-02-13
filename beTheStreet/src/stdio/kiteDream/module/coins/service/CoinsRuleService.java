package stdio.kiteDream.module.coins.service;

import java.util.List;

import stdio.kiteDream.module.coins.bean.Coins;
import stdio.kiteDream.module.coins.bean.CoinsRule;

public interface CoinsRuleService {

public CoinsRule getPrizeRule(String id);
	
	public List<CoinsRule> getLevelRules();
	
	public CoinsRule getLevelRule(int level);
	
	public Coins getUserCoins(int userid);

	public boolean savePrizeRule(CoinsRule rule);
	
	public boolean managePrize(int level,String userid);

	public boolean delPrizeRule(String id);

}